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

    const policies = [
      {
        id: "policy_001",
        title: "Information Security Policy",
        description: "Comprehensive policy covering all aspects of information security management",
        category: "Security",
        status: "Active",
        version: "2.1",
        lastUpdated: "2024-01-15T10:00:00Z",
        nextReview: "2025-01-15T10:00:00Z",
        owner: {
          id: "user_001",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com"
        },
        framework: "ISO 27001",
        compliance: "Compliant",
        attachments: [
          {
            name: "Information Security Policy v2.1.pdf",
            url: "/policies/info-security-v2.1.pdf",
            size: "1.2 MB"
          }
        ],
        acknowledgments: 45,
        tags: ["Security", "ISO 27001", "Governance"]
      },
      {
        id: "policy_002",
        title: "Data Protection and Privacy Policy",
        description: "Policy governing the collection, processing, and protection of personal data",
        category: "Privacy",
        status: "Active",
        version: "1.8",
        lastUpdated: "2024-01-10T14:30:00Z",
        nextReview: "2025-01-10T14:30:00Z",
        owner: {
          id: "user_002",
          name: "Mike Chen",
          email: "mike.chen@company.com"
        },
        framework: "GDPR",
        compliance: "Compliant",
        attachments: [
          {
            name: "Data Protection Policy v1.8.pdf",
            url: "/policies/data-protection-v1.8.pdf",
            size: "0.9 MB"
          }
        ],
        acknowledgments: 38,
        tags: ["Privacy", "GDPR", "Data Protection"]
      },
      {
        id: "policy_003",
        title: "Vendor Risk Management Policy",
        description: "Policy for assessing and managing risks associated with third-party vendors",
        category: "Risk Management",
        status: "Active",
        version: "3.0",
        lastUpdated: "2024-01-20T09:15:00Z",
        nextReview: "2025-01-20T09:15:00Z",
        owner: {
          id: "user_003",
          name: "Emily Davis",
          email: "emily.davis@company.com"
        },
        framework: "NIST CSF",
        compliance: "Compliant",
        attachments: [
          {
            name: "Vendor Risk Management Policy v3.0.pdf",
            url: "/policies/vendor-risk-v3.0.pdf",
            size: "1.5 MB"
          }
        ],
        acknowledgments: 52,
        tags: ["Risk Management", "Vendor", "NIST CSF"]
      },
      {
        id: "policy_004",
        title: "Incident Response Policy",
        description: "Policy for detecting, responding to, and recovering from security incidents",
        category: "Security",
        status: "Under Review",
        version: "1.5",
        lastUpdated: "2024-01-25T16:45:00Z",
        nextReview: "2024-04-25T16:45:00Z",
        owner: {
          id: "user_004",
          name: "David Wilson",
          email: "david.wilson@company.com"
        },
        framework: "SOC 2",
        compliance: "Under Review",
        attachments: [
          {
            name: "Incident Response Policy v1.5.pdf",
            url: "/policies/incident-response-v1.5.pdf",
            size: "1.1 MB"
          }
        ],
        acknowledgments: 29,
        tags: ["Security", "Incident Response", "SOC 2"]
      },
      {
        id: "policy_005",
        title: "Business Continuity Policy",
        description: "Policy for maintaining business operations during disruptions",
        category: "Operations",
        status: "Active",
        version: "2.3",
        lastUpdated: "2024-01-22T11:30:00Z",
        nextReview: "2025-01-22T11:30:00Z",
        owner: {
          id: "user_005",
          name: "Lisa Brown",
          email: "lisa.brown@company.com"
        },
        framework: "ISO 27001",
        compliance: "Compliant",
        attachments: [
          {
            name: "Business Continuity Policy v2.3.pdf",
            url: "/policies/business-continuity-v2.3.pdf",
            size: "1.8 MB"
          }
        ],
        acknowledgments: 41,
        tags: ["Operations", "Business Continuity", "ISO 27001"]
      }
    ];

    return NextResponse.json({
      success: true,
      data: policies,
      meta: {
        total: policies.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Policies API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
