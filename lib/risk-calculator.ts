/**
 * Risk Calculator Utility
 * Implements TPRM risk calculation algorithms
 */

export interface RiskFactors {
  likelihood: number; // 1-5 scale
  impact: number; // 1-5 scale
  businessImpact: number; // 1-10 scale
  controlEffectiveness: number; // 0-100 percentage
  externalFactors?: {
    industryRisk: number; // 1-5 scale
    geographicRisk: number; // 1-5 scale
    regulatoryRisk: number; // 1-5 scale
  };
}

export interface RiskScore {
  inherentRisk: number;
  residualRisk: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number; // 0-100
  businessImpactScore: number; // 0-100
}

export class RiskCalculator {
  /**
   * Calculate inherent risk based on likelihood, impact, and business impact
   */
  static calculateInherentRisk(factors: RiskFactors): number {
    const { likelihood, impact, businessImpact, externalFactors } = factors;
    
    // Base calculation: (likelihood * impact * businessImpact) / 3
    let baseScore = (likelihood * impact * businessImpact) / 3;
    
    // Apply external factors if provided
    if (externalFactors) {
      const externalMultiplier = (
        externalFactors.industryRisk + 
        externalFactors.geographicRisk + 
        externalFactors.regulatoryRisk
      ) / 3;
      baseScore = baseScore * (1 + (externalMultiplier - 3) * 0.1); // Adjust by ±10% based on external factors
    }
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.max(0, Math.round(baseScore * 4))); // Scale from 0-25 to 0-100
  }

  /**
   * Calculate residual risk after applying controls
   */
  static calculateResidualRisk(
    inherentRisk: number, 
    controlEffectiveness: number
  ): number {
    // Residual = Inherent * (1 - Control Effectiveness)
    const residual = inherentRisk * (1 - controlEffectiveness / 100);
    return Math.min(100, Math.max(0, Math.round(residual)));
  }

  /**
   * Calculate comprehensive risk score
   */
  static calculateRiskScore(factors: RiskFactors): RiskScore {
    const inherentRisk = this.calculateInherentRisk(factors);
    const residualRisk = this.calculateResidualRisk(inherentRisk, factors.controlEffectiveness);
    
    // Determine risk level based on residual risk
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    if (residualRisk <= 25) {
      riskLevel = 'Low';
    } else if (residualRisk <= 50) {
      riskLevel = 'Medium';
    } else if (residualRisk <= 75) {
      riskLevel = 'High';
    } else {
      riskLevel = 'Critical';
    }
    
    // Calculate business impact score (0-100)
    const businessImpactScore = Math.min(100, Math.max(0, factors.businessImpact * 10));
    
    return {
      inherentRisk,
      residualRisk,
      riskLevel,
      riskScore: residualRisk,
      businessImpactScore
    };
  }

  /**
   * Calculate risk score from questionnaire responses
   */
  static calculateRiskFromResponses(
    responses: Array<{
      questionId: string;
      answer: string | number | boolean;
      weight: number;
      riskWeight: number;
    }>,
    questions: Array<{
      id: string;
      weight: number;
      riskWeight: number;
      type: string;
    }>
  ): {
    inherentRisk: number;
    residualRisk: number;
    controlEffectiveness: number;
    overallScore: number;
  } {
    let totalWeight = 0;
    let weightedScore = 0;
    let totalRiskWeight = 0;
    let riskScore = 0;
    let controlScore = 0;
    let controlWeight = 0;

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question) return;

      // Calculate response score (0-5 scale)
      let responseScore = 0;
      if (typeof response.answer === 'number') {
        responseScore = Math.min(5, Math.max(1, response.answer));
      } else if (typeof response.answer === 'boolean') {
        responseScore = response.answer ? 5 : 1;
      } else if (typeof response.answer === 'string') {
        // For text responses, use a simple scoring based on length and keywords
        const text = response.answer.toLowerCase();
        if (text.includes('yes') || text.includes('implemented') || text.includes('compliant')) {
          responseScore = 5;
        } else if (text.includes('partial') || text.includes('some')) {
          responseScore = 3;
        } else if (text.includes('no') || text.includes('not') || text.includes('none')) {
          responseScore = 1;
        } else {
          responseScore = 3; // Default for unclear responses
        }
      }

      // Weight the score
      const weight = question.weight || 1;
      weightedScore += responseScore * weight;
      totalWeight += weight;

      // Calculate risk score (inverse of response score)
      const riskWeight = question.riskWeight || 1;
      riskScore += (6 - responseScore) * riskWeight; // Invert: 5 becomes 1, 1 becomes 5
      totalRiskWeight += riskWeight;

      // Calculate control effectiveness (for control-related questions)
      if (question.type === 'control' || response.questionId.includes('control')) {
        controlScore += responseScore * weight;
        controlWeight += weight;
      }
    });

    // Calculate final scores
    const overallScore = totalWeight > 0 ? (weightedScore / totalWeight) * 20 : 0; // Scale to 0-100
    const inherentRisk = totalRiskWeight > 0 ? (riskScore / totalRiskWeight) * 20 : 0; // Scale to 0-100
    const controlEffectiveness = controlWeight > 0 ? (controlScore / controlWeight) * 20 : 0; // Scale to 0-100
    const residualRisk = inherentRisk * (1 - controlEffectiveness / 100);

    return {
      inherentRisk: Math.round(inherentRisk),
      residualRisk: Math.round(residualRisk),
      controlEffectiveness: Math.round(controlEffectiveness),
      overallScore: Math.round(overallScore)
    };
  }

  /**
   * Calculate portfolio risk metrics
   */
  static calculatePortfolioRisk(vendors: Array<{
    inherentRisk: number;
    residualRisk: number;
    businessImpact: number;
    tier: number;
  }>): {
    averageInherentRisk: number;
    averageResidualRisk: number;
    highRiskVendors: number;
    criticalVendors: number;
    portfolioRiskScore: number;
  } {
    if (vendors.length === 0) {
      return {
        averageInherentRisk: 0,
        averageResidualRisk: 0,
        highRiskVendors: 0,
        criticalVendors: 0,
        portfolioRiskScore: 0
      };
    }

    const totalInherentRisk = vendors.reduce((sum, vendor) => sum + vendor.inherentRisk, 0);
    const totalResidualRisk = vendors.reduce((sum, vendor) => sum + vendor.residualRisk, 0);
    const totalBusinessImpact = vendors.reduce((sum, vendor) => sum + vendor.businessImpact, 0);

    const averageInherentRisk = totalInherentRisk / vendors.length;
    const averageResidualRisk = totalResidualRisk / vendors.length;
    const averageBusinessImpact = totalBusinessImpact / vendors.length;

    const highRiskVendors = vendors.filter(vendor => vendor.residualRisk > 50).length;
    const criticalVendors = vendors.filter(vendor => vendor.residualRisk > 75).length;

    // Portfolio risk score: weighted average of residual risk and business impact
    const portfolioRiskScore = (averageResidualRisk * 0.7) + (averageBusinessImpact * 3); // Scale business impact

    return {
      averageInherentRisk: Math.round(averageInherentRisk),
      averageResidualRisk: Math.round(averageResidualRisk),
      highRiskVendors,
      criticalVendors,
      portfolioRiskScore: Math.min(100, Math.round(portfolioRiskScore))
    };
  }

  /**
   * Generate risk recommendations
   */
  static generateRiskRecommendations(riskScore: RiskScore): string[] {
    const recommendations: string[] = [];

    if (riskScore.residualRisk > 75) {
      recommendations.push("Immediate risk mitigation required - consider vendor replacement");
      recommendations.push("Implement additional security controls");
      recommendations.push("Increase monitoring frequency");
    } else if (riskScore.residualRisk > 50) {
      recommendations.push("Develop risk mitigation plan");
      recommendations.push("Consider additional contractual protections");
      recommendations.push("Schedule quarterly risk reviews");
    } else if (riskScore.residualRisk > 25) {
      recommendations.push("Continue current risk management practices");
      recommendations.push("Schedule annual risk assessment");
    } else {
      recommendations.push("Maintain current risk management practices");
      recommendations.push("Consider reducing monitoring frequency");
    }

    if (riskScore.businessImpactScore > 80) {
      recommendations.push("High business impact - ensure business continuity planning");
    }

    return recommendations;
  }
}

/**
 * Risk Heatmap Utilities
 */
export class RiskHeatmapCalculator {
  /**
   * Calculate heatmap data points for visualization
   */
  static calculateHeatmapData(vendors: Array<{
    name: string;
    inherentRisk: number;
    residualRisk: number;
    businessImpact: number;
    tier: number;
  }>): Array<{
    x: number; // Likelihood (1-5)
    y: number; // Impact (1-5)
    r: number; // Business Impact (bubble size)
    residual: number; // Residual risk (color)
    name: string;
    tier: number;
  }> {
    return vendors.map(vendor => {
      // Convert risk scores to 1-5 scale for heatmap
      const likelihood = Math.min(5, Math.max(1, Math.round(vendor.inherentRisk / 20)));
      const impact = Math.min(5, Math.max(1, Math.round(vendor.businessImpact / 2)));
      const bubbleSize = Math.max(5, Math.min(20, vendor.businessImpact * 2)); // 5-20px bubble size
      
      return {
        x: likelihood,
        y: impact,
        r: bubbleSize,
        residual: vendor.residualRisk,
        name: vendor.name,
        tier: vendor.tier
      };
    });
  }

  /**
   * Get color for risk level
   */
  static getRiskColor(riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'): string {
    switch (riskLevel) {
      case 'Low': return '#10b981'; // Green
      case 'Medium': return '#f59e0b'; // Yellow
      case 'High': return '#ef4444'; // Red
      case 'Critical': return '#dc2626'; // Dark red
      default: return '#6b7280'; // Gray
    }
  }
}
