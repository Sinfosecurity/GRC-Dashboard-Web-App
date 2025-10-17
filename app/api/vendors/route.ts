import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from '@/lib/auth';
import { rateLimit } from '@/lib/validation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

    // Enhanced vendor data with TPRM structure
    const vendors = [
      { 
        id: "vendor_001",
        name: "Acme Analytics", 
        legalName: "Acme Analytics Inc.",
        website: "https://acme-analytics.com",
        industry: "Data Analytics",
        score: 72, 
        tier: 2, 
        criticality: "Medium",
        redFlags: 1,
        category: "Analytics",
        lastAssessment: "2024-01-15T10:00:00Z",
        nextReview: "2024-04-15T10:00:00Z",
        status: "Active",
        lifecycleState: "Active",
        compliance: ["SOC 2", "GDPR"],
        riskLevel: "Medium",
        inherentRisk: 75,
        residualRisk: 65,
        businessImpact: 7,
        businessOwner: {
          id: "user_001",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          department: "Data Science"
        },
        technicalOwner: {
          id: "user_002", 
          name: "Mike Chen",
          email: "mike.chen@company.com",
          department: "Engineering"
        },
        riskOwner: {
          id: "user_003",
          name: "Emily Davis", 
          email: "emily.davis@company.com",
          department: "Risk Management"
        },
        primaryContact: {
          name: "John Smith",
          email: "john.smith@acme-analytics.com",
          phone: "+1-555-0123",
          title: "Account Manager"
        },
        securityContact: {
          name: "Jane Wilson",
          email: "security@acme-analytics.com", 
          phone: "+1-555-0124",
          title: "CISO"
        },
        certifications: ["SOC 2 Type II", "ISO 27001"],
        complianceStatus: [
          {
            framework: "SOC 2",
            status: "Compliant",
            lastAssessed: "2024-01-15T10:00:00Z",
            nextAssessment: "2025-01-15T10:00:00Z"
          },
          {
            framework: "GDPR",
            status: "Compliant", 
            lastAssessed: "2024-01-10T09:00:00Z",
            nextAssessment: "2025-01-10T09:00:00Z"
          }
        ],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z"
      },
      { 
        id: "vendor_002",
        name: "CloudHelper Inc.", 
        legalName: "CloudHelper Technologies Inc.",
        website: "https://cloudhelper.io",
        industry: "Cloud Infrastructure",
        score: 58, 
        tier: 3, 
        criticality: "High",
        redFlags: 3,
        category: "Cloud Services",
        lastAssessment: "2024-01-10T14:30:00Z",
        nextReview: "2024-02-10T14:30:00Z",
        status: "Under Review",
        lifecycleState: "Monitoring",
        compliance: ["ISO 27001"],
        riskLevel: "High",
        inherentRisk: 85,
        residualRisk: 70,
        businessImpact: 9,
        businessOwner: {
          id: "user_004",
          name: "David Wilson",
          email: "david.wilson@company.com",
          department: "IT Operations"
        },
        technicalOwner: {
          id: "user_005",
          name: "Lisa Brown",
          email: "lisa.brown@company.com", 
          department: "Cloud Engineering"
        },
        riskOwner: {
          id: "user_003",
          name: "Emily Davis",
          email: "emily.davis@company.com",
          department: "Risk Management"
        },
        primaryContact: {
          name: "Robert Taylor",
          email: "robert.taylor@cloudhelper.io",
          phone: "+1-555-0125",
          title: "Sales Director"
        },
        securityContact: {
          name: "Maria Garcia",
          email: "security@cloudhelper.io",
          phone: "+1-555-0126", 
          title: "Security Manager"
        },
        certifications: ["ISO 27001"],
        complianceStatus: [
          {
            framework: "ISO 27001",
            status: "Under Review",
            lastAssessed: "2024-01-10T14:30:00Z",
            nextAssessment: "2024-02-10T14:30:00Z"
          }
        ],
        createdAt: "2024-01-05T00:00:00Z",
        updatedAt: "2024-01-15T16:45:00Z"
      },
      { 
        id: "vendor_003",
        name: "SecureMail", 
        legalName: "SecureMail Communications Ltd.",
        website: "https://securemail.com",
        industry: "Communication Services",
        score: 84, 
        tier: 1, 
        criticality: "Low",
        redFlags: 0,
        category: "Communication",
        lastAssessment: "2024-01-20T09:15:00Z",
        nextReview: "2024-07-20T09:15:00Z",
        status: "Approved",
        lifecycleState: "Active",
        compliance: ["SOC 2", "ISO 27001", "GDPR"],
        riskLevel: "Low",
        inherentRisk: 45,
        residualRisk: 35,
        businessImpact: 4,
        businessOwner: {
          id: "user_006",
          name: "Alex Thompson",
          email: "alex.thompson@company.com",
          department: "Communications"
        },
        technicalOwner: {
          id: "user_007",
          name: "Rachel Green",
          email: "rachel.green@company.com",
          department: "IT Security"
        },
        riskOwner: {
          id: "user_003",
          name: "Emily Davis",
          email: "emily.davis@company.com",
          department: "Risk Management"
        },
        primaryContact: {
          name: "Michael Johnson",
          email: "michael.johnson@securemail.com",
          phone: "+1-555-0127",
          title: "Account Executive"
        },
        securityContact: {
          name: "Jennifer Lee",
          email: "security@securemail.com",
          phone: "+1-555-0128",
          title: "CISO"
        },
        certifications: ["SOC 2 Type II", "ISO 27001:2022", "GDPR"],
        complianceStatus: [
          {
            framework: "SOC 2",
            status: "Compliant",
            lastAssessed: "2024-01-20T09:15:00Z",
            nextAssessment: "2025-01-20T09:15:00Z"
          },
          {
            framework: "ISO 27001",
            status: "Compliant",
            lastAssessed: "2024-01-18T11:00:00Z",
            nextAssessment: "2025-01-18T11:00:00Z"
          },
          {
            framework: "GDPR",
            status: "Compliant",
            lastAssessed: "2024-01-15T14:00:00Z",
            nextAssessment: "2025-01-15T14:00:00Z"
          }
        ],
        createdAt: "2024-01-08T00:00:00Z",
        updatedAt: "2024-01-22T10:30:00Z"
      }
    ];

    return NextResponse.json({
      success: true,
      data: vendors,
      meta: {
        total: vendors.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Vendors API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
