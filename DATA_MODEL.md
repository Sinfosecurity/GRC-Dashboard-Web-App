# TPRM Platform Data Model

## 🏗️ **Canonical Entity Model**

Based on the ER sketch provided, here's the comprehensive data model for the TPRM platform:

## **Core Entities**

### **1. BusinessService**
```typescript
interface BusinessService {
  id: string;
  name: string;
  description: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  businessOwner: User;
  technicalOwner: User;
  riskOwner: User;
  status: 'Active' | 'Inactive' | 'Deprecated';
  createdAt: Date;
  updatedAt: Date;
  // Relationships
  vendors: Vendor[];
  risks: Risk[];
  controls: Control[];
}
```

### **2. Vendor**
```typescript
interface Vendor {
  id: string;
  name: string;
  legalName: string;
  website: string;
  industry: string;
  tier: 1 | 2 | 3;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Prospect' | 'Onboarding' | 'Active' | 'Under Review' | 'Suspended' | 'Terminated';
  
  // Ownership & RACI
  businessOwner: User;
  technicalOwner: User;
  riskOwner: User;
  procurementOwner: User;
  
  // Risk Assessment
  inherentRisk: number;
  residualRisk: number;
  businessImpact: number;
  lastAssessment: Date;
  nextReview: Date;
  
  // Compliance
  certifications: Certification[];
  complianceStatus: ComplianceStatus[];
  
  // Contact Information
  primaryContact: Contact;
  securityContact: Contact;
  legalContact: Contact;
  
  // Relationships
  products: Product[];
  contracts: Contract[];
  assessments: Assessment[];
  findings: Finding[];
  tasks: Task[];
  dataFlows: DataFlow[];
  fourthParties: FourthParty[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **3. Product/Service**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Software' | 'Hardware' | 'Service' | 'Data Processing';
  vendor: Vendor;
  businessServices: BusinessService[];
  
  // Risk Assessment
  inherentRisk: number;
  residualRisk: number;
  businessImpact: number;
  
  // Technical Details
  dataTypes: DataType[];
  processingPurposes: ProcessingPurpose[];
  dataResidency: DataResidency;
  
  // Compliance
  certifications: Certification[];
  controls: Control[];
  
  status: 'Active' | 'Inactive' | 'Deprecated';
  createdAt: Date;
  updatedAt: Date;
}
```

### **4. Contract**
```typescript
interface Contract {
  id: string;
  name: string;
  type: 'DPA' | 'SLA' | 'SCC' | 'NDA' | 'MSA' | 'SOW';
  vendor: Vendor;
  businessService: BusinessService;
  
  // Contract Details
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  autoRenewal: boolean;
  value: number;
  currency: string;
  
  // Legal & Compliance
  dataProcessingAgreement: boolean;
  standardContractualClauses: boolean;
  dataResidency: string;
  transferMechanisms: TransferMechanism[];
  
  // Status
  status: 'Draft' | 'Under Review' | 'Active' | 'Expired' | 'Terminated';
  version: string;
  previousVersion?: Contract;
  
  // Documents
  documents: Document[];
  
  // Alerts
  renewalAlerts: Alert[];
  expiryAlerts: Alert[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **5. Assessment**
```typescript
interface Assessment {
  id: string;
  name: string;
  type: 'Initial' | 'Periodic' | 'Ad-hoc' | 'Renewal';
  vendor: Vendor;
  businessService: BusinessService;
  
  // Assessment Details
  status: 'Draft' | 'Sent' | 'In Progress' | 'Completed' | 'Overdue';
  startDate: Date;
  dueDate: Date;
  completionDate?: Date;
  
  // Questionnaire
  questionnaire: Questionnaire;
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
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **6. Questionnaire**
```typescript
interface Questionnaire {
  id: string;
  name: string;
  type: 'SIG' | 'SIG_LITE' | 'CAIQ' | 'CUSTOM' | 'AI_POWERED';
  version: string;
  description: string;
  
  // Template Details
  category: string;
  framework: Framework;
  estimatedTime: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  
  // Questions
  questions: Question[];
  
  // Logic
  branchingLogic: BranchingRule[];
  conditionalLogic: ConditionalRule[];
  
  // Status
  status: 'Draft' | 'Published' | 'Archived';
  isTemplate: boolean;
  
  // Usage
  usageCount: number;
  averageCompletionTime: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **7. Question**
```typescript
interface Question {
  id: string;
  text: string;
  description?: string;
  type: 'Multiple Choice' | 'Single Choice' | 'Text' | 'Number' | 'Date' | 'File Upload' | 'URL';
  
  // Options (for choice questions)
  options: QuestionOption[];
  
  // Validation
  required: boolean;
  validationRules: ValidationRule[];
  
  // Control Mapping
  controls: Control[];
  frameworkRequirements: FrameworkRequirement[];
  
  // Logic
  conditionalLogic: ConditionalRule[];
  skipLogic: SkipRule[];
  
  // Scoring
  weight: number;
  riskWeight: number;
  
  // Metadata
  category: string;
  subcategory: string;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **8. Response**
```typescript
interface Response {
  id: string;
  question: Question;
  assessment: Assessment;
  vendor: Vendor;
  
  // Response Data
  answer: string | number | boolean | File | Date;
  textAnswer?: string;
  selectedOptions: QuestionOption[];
  fileUploads: FileUpload[];
  
  // Evidence
  evidence: Evidence[];
  supportingDocuments: Document[];
  
  // Validation
  isValid: boolean;
  validationErrors: ValidationError[];
  
  // Scoring
  score: number;
  riskScore: number;
  
  // Metadata
  answeredBy: User;
  answeredAt: Date;
  lastModified: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **9. Evidence**
```typescript
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
  expiryDate?: Date;
  
  // Control Mapping
  controls: Control[];
  frameworkRequirements: FrameworkRequirement[];
  
  // Relationships
  response: Response;
  assessment: Assessment;
  vendor: Vendor;
  
  // Metadata
  uploadedBy: User;
  uploadedAt: Date;
  lastVerified: Date;
  
  // Security
  isRedacted: boolean;
  containsPII: boolean;
  accessLevel: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **10. Control**
```typescript
interface Control {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  
  // Framework Mapping
  frameworkRequirements: FrameworkRequirement[];
  
  // Implementation
  implementationStatus: 'Not Implemented' | 'Partially Implemented' | 'Fully Implemented' | 'Not Applicable';
  effectiveness: number; // 0-100
  lastTested: Date;
  nextTest: Date;
  
  // Ownership
  owner: User;
  businessOwner: User;
  technicalOwner: User;
  
  // Relationships
  vendors: Vendor[];
  products: Product[];
  businessServices: BusinessService[];
  assessments: Assessment[];
  findings: Finding[];
  tasks: Task[];
  
  // Metadata
  tags: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **11. FrameworkRequirement**
```typescript
interface FrameworkRequirement {
  id: string;
  framework: Framework;
  requirementId: string;
  title: string;
  description: string;
  category: string;
  
  // Mapping
  controls: Control[];
  questions: Question[];
  evidence: Evidence[];
  
  // Compliance
  isCompliant: boolean;
  complianceScore: number;
  lastAssessed: Date;
  
  // Metadata
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **12. Framework**
```typescript
interface Framework {
  id: string;
  name: string;
  version: string;
  description: string;
  type: 'Security' | 'Privacy' | 'Compliance' | 'Quality';
  
  // Examples: SOC 2, ISO 27001, NIST 800-53, PCI DSS, HIPAA, GDPR, DORA, NIS2
  
  // Requirements
  requirements: FrameworkRequirement[];
  
  // Metadata
  isActive: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **13. Risk**
```typescript
interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'Operational' | 'Financial' | 'Reputational' | 'Compliance' | 'Strategic';
  
  // Risk Assessment
  inherentLikelihood: number; // 1-5
  inherentImpact: number; // 1-5
  inherentRisk: number; // calculated
  residualLikelihood: number; // 1-5
  residualImpact: number; // 1-5
  residualRisk: number; // calculated
  
  // Business Impact
  businessImpact: number; // 1-5
  financialImpact: number;
  reputationalImpact: number;
  
  // Risk Appetite
  riskAppetite: 'Accept' | 'Mitigate' | 'Transfer' | 'Avoid';
  riskTolerance: number;
  
  // Relationships
  vendor: Vendor;
  businessService: BusinessService;
  controls: Control[];
  findings: Finding[];
  tasks: Task[];
  
  // Status
  status: 'Open' | 'Mitigating' | 'Accepted' | 'Transferred' | 'Closed';
  
  // Ownership
  owner: User;
  riskOwner: User;
  
  // Dates
  identifiedDate: Date;
  lastReview: Date;
  nextReview: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **14. Finding**
```typescript
interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // Source
  source: 'Assessment' | 'Monitoring' | 'Audit' | 'Manual';
  sourceId: string; // ID of the source assessment/monitoring event
  
  // Relationships
  vendor: Vendor;
  businessService: BusinessService;
  assessment: Assessment;
  controls: Control[];
  risks: Risk[];
  tasks: Task[];
  
  // Status
  status: 'Open' | 'In Progress' | 'Resolved' | 'Accepted' | 'False Positive';
  
  // Ownership
  owner: User;
  assignedTo: User;
  
  // Dates
  identifiedDate: Date;
  dueDate: Date;
  resolvedDate?: Date;
  
  // Evidence
  evidence: Evidence[];
  remediationEvidence: Evidence[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **15. Task**
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'Remediation' | 'Review' | 'Approval' | 'Follow-up' | 'Assessment';
  
  // Priority & Status
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue';
  
  // SLA
  sla: SLA;
  dueDate: Date;
  completedDate?: Date;
  
  // Relationships
  vendor: Vendor;
  businessService: BusinessService;
  finding: Finding;
  risk: Risk;
  control: Control;
  assessment: Assessment;
  
  // Ownership
  owner: User;
  assignedTo: User;
  
  // Approvals
  approvals: Approval[];
  
  // Dependencies
  dependencies: Task[];
  blockingTasks: Task[];
  
  // Progress
  progress: number; // 0-100
  estimatedHours: number;
  actualHours: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **16. User/Role**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  
  // Authentication
  isActive: boolean;
  lastLogin: Date;
  passwordLastChanged: Date;
  
  // Roles & Permissions
  roles: Role[];
  permissions: Permission[];
  
  // Profile
  department: string;
  jobTitle: string;
  manager: User;
  directReports: User[];
  
  // Preferences
  preferences: UserPreferences;
  notifications: NotificationSettings;
  
  // Relationships
  ownedVendors: Vendor[];
  ownedBusinessServices: BusinessService[];
  assignedTasks: Task[];
  createdFindings: Finding[];
  
  createdAt: Date;
  updatedAt: Date;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
  createdAt: Date;
  updatedAt: Date;
}
```

## **Supporting Entities**

### **17. DataFlow**
```typescript
interface DataFlow {
  id: string;
  name: string;
  description: string;
  vendor: Vendor;
  businessService: BusinessService;
  
  // Data Details
  dataTypes: DataType[];
  dataCategories: DataCategory[];
  processingPurposes: ProcessingPurpose[];
  
  // Transfer Details
  sourceCountry: string;
  destinationCountry: string;
  transferMechanism: TransferMechanism;
  
  // Risk
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // Compliance
  isLawful: boolean;
  lawfulBasis: LawfulBasis[];
  retentionPeriod: number; // days
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **18. FourthParty**
```typescript
interface FourthParty {
  id: string;
  name: string;
  description: string;
  vendor: Vendor; // The third party that uses this fourth party
  businessService: BusinessService;
  
  // Risk Assessment
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  inherentRisk: number;
  residualRisk: number;
  
  // Discovery
  discoveryMethod: 'Declared' | 'Observed' | 'Detected';
  discoveryDate: Date;
  
  // Data Processing
  dataTypes: DataType[];
  processingPurposes: ProcessingPurpose[];
  
  // Status
  status: 'Active' | 'Under Review' | 'Approved' | 'Rejected';
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **19. SLA (Service Level Agreement)**
```typescript
interface SLA {
  id: string;
  name: string;
  description: string;
  
  // SLA Metrics
  responseTime: number; // hours
  resolutionTime: number; // hours
  escalationTime: number; // hours
  
  // Escalation
  escalationRules: EscalationRule[];
  
  // Notifications
  notificationRules: NotificationRule[];
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### **20. Approval**
```typescript
interface Approval {
  id: string;
  type: 'Risk Acceptance' | 'Exception' | 'Offboarding' | 'Contract' | 'Assessment';
  
  // Request
  requestedBy: User;
  requestedAt: Date;
  reason: string;
  justification: string;
  
  // Approval Chain
  approvers: Approver[];
  currentApprover: User;
  
  // Status
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired';
  approvedAt?: Date;
  rejectedAt?: Date;
  expiryDate: Date;
  
  // Relationships
  task: Task;
  finding: Finding;
  risk: Risk;
  contract: Contract;
  assessment: Assessment;
  
  createdAt: Date;
  updatedAt: Date;
}
```

## **📊 Data Model Relationships**

### **Primary Relationships**
- `BusinessService` ──< uses >── `Vendor` ──< provides >── `Product`
- `Vendor` ──< has >── `Contract` (DPA/SLA)
- `Assessment` ──< includes >── `Questionnaire` ──< has >── `Question`
- `Question` ──< answered_by >── `Response` ──< evidence >── `Evidence`
- `Assessment` ──< maps_to >── `Control` ──< crosswalk >── `FrameworkRequirement`
- `Finding` ──< mitigates >── `Risk`
- `Task` ──< owners/SLAs/approvals >── `User`

### **Key Relationships**
- **Vendor → BusinessService**: Many-to-many (vendors can serve multiple business services)
- **Assessment → Questionnaire**: One-to-many (one assessment uses one questionnaire)
- **Question → Response**: One-to-many (one question can have multiple responses across assessments)
- **Control → FrameworkRequirement**: Many-to-many (controls can map to multiple framework requirements)
- **Finding → Task**: One-to-many (findings can generate multiple remediation tasks)
- **User → Role**: Many-to-many (users can have multiple roles)

## **🔐 Security & Compliance**

### **Data Classification**
- **Public**: Framework requirements, control descriptions
- **Internal**: Vendor information, assessment data
- **Confidential**: Risk scores, findings, evidence
- **Restricted**: Personal data, financial information

### **Audit Trail**
- All entities include `createdAt` and `updatedAt` timestamps
- Critical entities include `createdBy` and `updatedBy` user references
- Immutable audit logs for all data modifications
- Evidence integrity through cryptographic hashing

### **Data Retention**
- **Active Data**: Indefinite for active vendors/assessments
- **Archived Data**: 7 years for compliance requirements
- **Audit Logs**: 10 years for regulatory compliance
- **Evidence**: Immutable, permanent retention

This data model provides the foundation for a comprehensive TPRM platform that can scale from MVP to enterprise-grade implementation.
