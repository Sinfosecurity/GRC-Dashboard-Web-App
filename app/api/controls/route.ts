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

    const controls = [
      {
        id: "control_001",
        name: "Access Control",
        description: "Implement and maintain access controls to ensure only authorized users can access systems and data",
        framework: "SOC 2",
        category: "Security",
        status: "Implemented",
        coverage: 85,
        evidence: [
          {
            id: "evidence_001",
            name: "SOC 2 Type II Report",
            status: "Approved"
          }
        ],
        vendors: [
          {
            id: "vendor_001",
            name: "Acme Analytics",
            compliance: "Compliant"
          }
        ],
        lastAssessed: "2024-01-15T10:00:00Z",
        nextAssessment: "2025-01-15T10:00:00Z",
        owner: {
          id: "user_001",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com"
        }
      },
      {
        id: "control_002",
        name: "Information Security Management",
        description: "Establish and maintain an information security management system",
        framework: "ISO 27001",
        category: "Governance",
        status: "Implemented",
        coverage: 92,
        evidence: [
          {
            id: "evidence_002",
            name: "ISO 27001 Certificate",
            status: "Under Review"
          }
        ],
        vendors: [
          {
            id: "vendor_002",
            name: "CloudHelper Inc.",
            compliance: "Under Review"
          }
        ],
        lastAssessed: "2024-01-10T14:30:00Z",
        nextAssessment: "2025-01-10T14:30:00Z",
        owner: {
          id: "user_002",
          name: "Mike Chen",
          email: "mike.chen@company.com"
        }
      },
      {
        id: "control_003",
        name: "Data Protection",
        description: "Implement appropriate technical and organizational measures to protect personal data",
        framework: "GDPR",
        category: "Privacy",
        status: "Implemented",
        coverage: 78,
        evidence: [
          {
            id: "evidence_003",
            name: "GDPR Compliance Statement",
            status: "Approved"
          }
        ],
        vendors: [
          {
            id: "vendor_003",
            name: "SecureMail",
            compliance: "Compliant"
          }
        ],
        lastAssessed: "2024-01-20T09:15:00Z",
        nextAssessment: "2025-01-20T09:15:00Z",
        owner: {
          id: "user_003",
          name: "Emily Davis",
          email: "emily.davis@company.com"
        }
      },
      {
        id: "control_004",
        name: "Vulnerability Management",
        description: "Identify, assess, and remediate security vulnerabilities",
        framework: "NIST CSF",
        category: "Security",
        status: "In Progress",
        coverage: 65,
        evidence: [
          {
            id: "evidence_004",
            name: "Penetration Test Report",
            status: "Pending"
          }
        ],
        vendors: [
          {
            id: "vendor_004",
            name: "DataCorp Solutions",
            compliance: "In Progress"
          }
        ],
        lastAssessed: "2024-01-25T16:45:00Z",
        nextAssessment: "2024-04-25T16:45:00Z",
        owner: {
          id: "user_004",
          name: "David Wilson",
          email: "david.wilson@company.com"
        }
      },
      {
        id: "control_005",
        name: "Business Continuity",
        description: "Maintain business continuity and disaster recovery capabilities",
        framework: "ISO 27001",
        category: "Operations",
        status: "Under Review",
        coverage: 70,
        evidence: [
          {
            id: "evidence_005",
            name: "Business Continuity Plan",
            status: "Under Review"
          }
        ],
        vendors: [
          {
            id: "vendor_005",
            name: "TechFlow Systems",
            compliance: "Under Review"
          }
        ],
        lastAssessed: "2024-01-22T11:30:00Z",
        nextAssessment: "2025-01-22T11:30:00Z",
        owner: {
          id: "user_005",
          name: "Lisa Brown",
          email: "lisa.brown@company.com"
        }
      }
    ];

    return NextResponse.json({
      success: true,
      data: controls,
      meta: {
        total: controls.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Controls API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
