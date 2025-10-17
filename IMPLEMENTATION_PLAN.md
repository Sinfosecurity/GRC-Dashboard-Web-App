# TPRM Platform Implementation Plan

## 🎯 **Immediate Next Steps (Week 1-2)**

Based on your comprehensive specification, here's the practical implementation plan starting from our current MVP:

## **Phase 1A: Enhanced Vendor Management (Week 1)**

### **1.1 Update Vendor Data Model**
Let's enhance our current vendor structure to match the TPRM requirements:

```typescript
// Update app/api/vendors/route.ts
interface EnhancedVendor {
  id: string;
  name: string;
  legalName: string;
  website: string;
  industry: string;
  tier: 1 | 2 | 3;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Prospect' | 'Onboarding' | 'Active' | 'Under Review' | 'Suspended' | 'Terminated';
  
  // Ownership & RACI
  businessOwner: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  technicalOwner: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  riskOwner: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  
  // Risk Assessment
  inherentRisk: number;
  residualRisk: number;
  businessImpact: number;
  lastAssessment: string;
  nextReview: string;
  
  // Lifecycle
  lifecycleState: 'Sourcing' | 'Onboarding' | 'Active' | 'Monitoring' | 'Offboarding';
  
  // Compliance
  certifications: string[];
  complianceStatus: {
    framework: string;
    status: 'Compliant' | 'Non-Compliant' | 'Under Review';
    lastAssessed: string;
    nextAssessment: string;
  }[];
  
  // Contact Information
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  securityContact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}
```

### **1.2 Create Contract Management API**
```typescript
// app/api/contracts/route.ts
interface Contract {
  id: string;
  name: string;
  type: 'DPA' | 'SLA' | 'SCC' | 'NDA' | 'MSA' | 'SOW';
  vendorId: string;
  businessServiceId: string;
  
  // Contract Details
  startDate: string;
  endDate: string;
  renewalDate: string;
  autoRenewal: boolean;
  value: number;
  currency: string;
  
  // Legal & Compliance
  dataProcessingAgreement: boolean;
  standardContractualClauses: boolean;
  dataResidency: string;
  
  // Status
  status: 'Draft' | 'Under Review' | 'Active' | 'Expired' | 'Terminated';
  version: string;
  
  // Alerts
  renewalAlerts: {
    daysBefore: number;
    sent: boolean;
    sentAt?: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
}
```

### **1.3 Implement Fourth-Party Discovery**
```typescript
// app/api/fourth-parties/route.ts
interface FourthParty {
  id: string;
  name: string;
  description: string;
  vendorId: string;
  businessServiceId: string;
  
  // Risk Assessment
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  inherentRisk: number;
  residualRisk: number;
  
  // Discovery
  discoveryMethod: 'Declared' | 'Observed' | 'Detected';
  discoveryDate: string;
  
  // Data Processing
  dataTypes: string[];
  processingPurposes: string[];
  
  // Status
  status: 'Active' | 'Under Review' | 'Approved' | 'Rejected';
  
  createdAt: string;
  updatedAt: string;
}
```

## **Phase 1B: Advanced Questionnaire System (Week 2)**

### **2.1 Create Questionnaire Templates API**
```typescript
// app/api/questionnaires/route.ts
interface QuestionnaireTemplate {
  id: string;
  name: string;
  type: 'SIG' | 'SIG_LITE' | 'CAIQ' | 'CUSTOM' | 'AI_POWERED';
  version: string;
  description: string;
  
  // Template Details
  category: string;
  framework: string;
  estimatedTime: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  
  // Questions
  questions: Question[];
  
  // Status
  status: 'Draft' | 'Published' | 'Archived';
  isTemplate: boolean;
  
  // Usage
  usageCount: number;
  averageCompletionTime: number;
  
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: string;
  text: string;
  description?: string;
  type: 'Multiple Choice' | 'Single Choice' | 'Text' | 'Number' | 'Date' | 'File Upload' | 'URL';
  
  // Options (for choice questions)
  options: {
    id: string;
    text: string;
    value: string;
    riskWeight: number;
  }[];
  
  // Validation
  required: boolean;
  validationRules: {
    type: 'min' | 'max' | 'pattern' | 'required';
    value: any;
    message: string;
  }[];
  
  // Control Mapping
  controls: string[];
  frameworkRequirements: string[];
  
  // Scoring
  weight: number;
  riskWeight: number;
  
  // Metadata
  category: string;
  subcategory: string;
  tags: string[];
  
  createdAt: string;
  updatedAt: string;
}
```

### **2.2 Implement Assessment Workflow**
```typescript
// app/api/assessments/route.ts
interface Assessment {
  id: string;
  name: string;
  type: 'Initial' | 'Periodic' | 'Ad-hoc' | 'Renewal';
  vendorId: string;
  businessServiceId: string;
  
  // Assessment Details
  status: 'Draft' | 'Sent' | 'In Progress' | 'Completed' | 'Overdue';
  startDate: string;
  dueDate: string;
  completionDate?: string;
  
  // Questionnaire
  questionnaireId: string;
  questionnaire: QuestionnaireTemplate;
  responses: Response[];
  
  // Scoring
  inherentRisk: number;
  residualRisk: number;
  controlEffectiveness: number;
  overallScore: number;
  
  // Findings
  findings: Finding[];
  recommendations: Recommendation[];
  
  // Approvals
  approvals: Approval[];
  
  createdAt: string;
  updatedAt: string;
}
```

## **Phase 1C: Risk Modeling & Analytics (Week 3)**

### **3.1 Implement Risk Calculation Engine**
```typescript
// lib/risk-calculator.ts
export class RiskCalculator {
  static calculateInherentRisk(
    likelihood: number,
    impact: number,
    businessImpact: number
  ): number {
    // Weighted calculation: (likelihood * impact * businessImpact) / 3
    return Math.round((likelihood * impact * businessImpact) / 3);
  }
  
  static calculateResidualRisk(
    inherentRisk: number,
    controlEffectiveness: number
  ): number {
    // Residual = Inherent * (1 - Control Effectiveness)
    return Math.round(inherentRisk * (1 - controlEffectiveness / 100));
  }
  
  static calculateRiskScore(
    responses: Response[],
    questions: Question[]
  ): {
    inherentRisk: number;
    residualRisk: number;
    controlEffectiveness: number;
    overallScore: number;
  } {
    // Implementation of risk scoring algorithm
    // Based on question weights, response values, and control mapping
  }
}
```

### **3.2 Create Risk Heatmap Component**
```typescript
// components/risk/RiskHeatmap.tsx
interface RiskHeatmapProps {
  vendors: EnhancedVendor[];
  risks: Risk[];
  onVendorClick: (vendor: EnhancedVendor) => void;
}

export function RiskHeatmap({ vendors, risks, onVendorClick }: RiskHeatmapProps) {
  // Implementation of interactive risk heatmap
  // X-axis: Likelihood, Y-axis: Impact
  // Bubble size: Business Impact
  // Color: Risk Level
}
```

## **Phase 1D: Evidence Management (Week 4)**

### **4.1 Implement Evidence Upload System**
```typescript
// app/api/evidence/route.ts
interface Evidence {
  id: string;
  name: string;
  description: string;
  type: 'Document' | 'Screenshot' | 'URL' | 'Attestation' | 'Certificate';
  
  // File Information
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileHash: string; // SHA-256
  filePath: string;
  
  // Validation
  isValid: boolean;
  integrityCheck: boolean;
  expiryDate?: string;
  
  // Control Mapping
  controls: string[];
  frameworkRequirements: string[];
  
  // Relationships
  responseId: string;
  assessmentId: string;
  vendorId: string;
  
  // Metadata
  uploadedBy: string;
  uploadedAt: string;
  lastVerified: string;
  
  // Security
  isRedacted: boolean;
  containsPII: boolean;
  accessLevel: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  
  createdAt: string;
  updatedAt: string;
}
```

### **4.2 Create Control Mapping System**
```typescript
// app/api/controls/route.ts
interface Control {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  
  // Framework Mapping
  frameworkRequirements: {
    framework: string;
    requirementId: string;
    title: string;
    description: string;
  }[];
  
  // Implementation
  implementationStatus: 'Not Implemented' | 'Partially Implemented' | 'Fully Implemented' | 'Not Applicable';
  effectiveness: number; // 0-100
  lastTested: string;
  nextTest: string;
  
  // Ownership
  owner: string;
  businessOwner: string;
  technicalOwner: string;
  
  // Relationships
  vendors: string[];
  products: string[];
  businessServices: string[];
  assessments: string[];
  findings: string[];
  tasks: string[];
  
  // Metadata
  tags: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  
  createdAt: string;
  updatedAt: string;
}
```

## **🚀 Implementation Priority**

### **Week 1: Foundation**
1. ✅ Enhanced vendor data model
2. ✅ Contract management API
3. ✅ Fourth-party discovery
4. ✅ Basic risk calculation

### **Week 2: Assessments**
1. ✅ Questionnaire templates
2. ✅ Assessment workflow
3. ✅ Response management
4. ✅ Basic scoring

### **Week 3: Risk & Analytics**
1. ✅ Risk calculation engine
2. ✅ Risk heatmap visualization
3. ✅ Control mapping
4. ✅ Framework requirements

### **Week 4: Evidence & Controls**
1. ✅ Evidence upload system
2. ✅ Control management
3. ✅ Framework crosswalks
4. ✅ Basic reporting

## **📋 Acceptance Criteria**

### **MVP Completion Criteria**
- [ ] Add a vendor with tier/criticality and business owner
- [ ] Send a questionnaire to vendor
- [ ] Vendor answers via portal and uploads evidence
- [ ] Answers are mapped to controls
- [ ] System computes residual risk
- [ ] Findings auto-create remediation tasks with SLA timers
- [ ] Dashboard shows portfolio risk & coverage
- [ ] All actions are audit-logged
- [ ] Admins can export evidence and reports

### **Technical Requirements**
- API response time < 200ms
- Support for 1000+ vendors
- 50+ concurrent users
- 99.9% uptime
- < 1% error rate

## **🔧 Next Immediate Actions**

1. **Update Vendor API** (Today)
   - Enhance vendor data structure
   - Add ownership fields
   - Add lifecycle states

2. **Create Contract API** (Tomorrow)
   - Basic contract management
   - Renewal alerts
   - Status tracking

3. **Implement Risk Calculator** (Day 3)
   - Inherent risk calculation
   - Residual risk calculation
   - Control effectiveness scoring

4. **Create Assessment Workflow** (Day 4-5)
   - Questionnaire templates
   - Assessment creation
   - Response management

This plan provides a clear path from our current MVP to a comprehensive TPRM platform that meets your specification requirements.
