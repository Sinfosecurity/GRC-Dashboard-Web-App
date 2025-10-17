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

    const reports = [
      {
        id: "report_001",
        name: "Executive Risk Dashboard",
        description: "High-level overview of organizational risk posture",
        type: "Dashboard",
        category: "Risk Management",
        status: "Active",
        lastGenerated: "2024-01-20T10:00:00Z",
        nextScheduled: "2024-02-20T10:00:00Z",
        frequency: "Monthly",
        recipients: [
          "executives@company.com",
          "cfo@company.com",
          "ciso@company.com"
        ],
        format: "PDF",
        size: "2.1 MB",
        url: "/reports/executive-risk-dashboard-2024-01.pdf"
      },
      {
        id: "report_002",
        name: "Vendor Compliance Report",
        description: "Comprehensive compliance status of all vendors",
        type: "Compliance",
        category: "Vendor Management",
        status: "Active",
        lastGenerated: "2024-01-15T14:30:00Z",
        nextScheduled: "2024-02-15T14:30:00Z",
        frequency: "Monthly",
        recipients: [
          "compliance@company.com",
          "procurement@company.com"
        ],
        format: "Excel",
        size: "1.8 MB",
        url: "/reports/vendor-compliance-2024-01.xlsx"
      },
      {
        id: "report_003",
        name: "Security Assessment Summary",
        description: "Summary of security assessments and findings",
        type: "Assessment",
        category: "Security",
        status: "Active",
        lastGenerated: "2024-01-10T09:15:00Z",
        nextScheduled: "2024-02-10T09:15:00Z",
        frequency: "Monthly",
        recipients: [
          "security@company.com",
          "ciso@company.com"
        ],
        format: "PDF",
        size: "3.2 MB",
        url: "/reports/security-assessment-2024-01.pdf"
      },
      {
        id: "report_004",
        name: "Task Progress Report",
        description: "Progress tracking of all active tasks and assignments",
        type: "Progress",
        category: "Task Management",
        status: "Active",
        lastGenerated: "2024-01-25T16:45:00Z",
        nextScheduled: "2024-02-01T16:45:00Z",
        frequency: "Weekly",
        recipients: [
          "managers@company.com",
          "project-leads@company.com"
        ],
        format: "PDF",
        size: "1.5 MB",
        url: "/reports/task-progress-2024-01.pdf"
      },
      {
        id: "report_005",
        name: "Evidence Audit Trail",
        description: "Complete audit trail of all evidence and documentation",
        type: "Audit",
        category: "Evidence Management",
        status: "Active",
        lastGenerated: "2024-01-22T11:30:00Z",
        nextScheduled: "2024-02-22T11:30:00Z",
        frequency: "Monthly",
        recipients: [
          "audit@company.com",
          "compliance@company.com"
        ],
        format: "CSV",
        size: "0.9 MB",
        url: "/reports/evidence-audit-2024-01.csv"
      }
    ];

    return NextResponse.json({
      success: true,
      data: reports,
      meta: {
        total: reports.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, category, frequency, recipients, format } = body;

    // Validate required fields
    if (!name || !description || !type || !category || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new report
    const newReport = {
      id: `report_${Date.now()}`,
      name,
      description,
      type,
      category,
      status: "Pending",
      lastGenerated: null,
      nextScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      frequency,
      recipients: recipients || [],
      format: format || "PDF",
      size: "0 MB",
      url: null
    };

    return NextResponse.json({
      success: true,
      data: newReport,
      message: 'Report created successfully'
    });

  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
