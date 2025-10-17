import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from '@/lib/auth';
import { rateLimit } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // For demo purposes, skip authentication check
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const analytics = {
      overview: {
        totalVendors: 25,
        activeVendors: 20,
        highRiskVendors: 3,
        mediumRiskVendors: 8,
        lowRiskVendors: 9,
        totalTasks: 45,
        completedTasks: 32,
        pendingTasks: 13,
        overdueTasks: 2,
        totalEvidence: 78,
        approvedEvidence: 65,
        pendingEvidence: 13,
        totalPolicies: 12,
        activePolicies: 10,
        underReviewPolicies: 2
      },
      riskTrends: [
        { month: "Jan", high: 2, medium: 6, low: 8 },
        { month: "Feb", high: 3, medium: 7, low: 7 },
        { month: "Mar", high: 2, medium: 8, low: 9 },
        { month: "Apr", high: 3, medium: 8, low: 9 }
      ],
      vendorDistribution: [
        { category: "Technology", count: 8, percentage: 32 },
        { category: "Cloud Services", count: 6, percentage: 24 },
        { category: "Security", count: 4, percentage: 16 },
        { category: "Communication", count: 3, percentage: 12 },
        { category: "Other", count: 4, percentage: 16 }
      ],
      complianceStatus: [
        { framework: "SOC 2", compliant: 15, nonCompliant: 2, inProgress: 3 },
        { framework: "ISO 27001", compliant: 12, nonCompliant: 1, inProgress: 4 },
        { framework: "GDPR", compliant: 18, nonCompliant: 1, inProgress: 1 },
        { framework: "NIST CSF", compliant: 10, nonCompliant: 3, inProgress: 2 }
      ],
      taskMetrics: {
        averageCompletionTime: 5.2, // days
        onTimeCompletion: 78, // percentage
        overdueRate: 12, // percentage
        highPriorityTasks: 8,
        criticalTasks: 2
      },
      evidenceMetrics: {
        averageReviewTime: 3.1, // days
        approvalRate: 83, // percentage
        rejectionRate: 5, // percentage
        pendingReview: 13
      },
      policyMetrics: {
        averageAcknowledgment: 42, // count
        acknowledgmentRate: 89, // percentage
        overdueReviews: 1,
        upcomingReviews: 3
      }
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      meta: {
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
