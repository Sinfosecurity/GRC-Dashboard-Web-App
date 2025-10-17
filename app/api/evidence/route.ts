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

    const evidence = [
      {
        id: "evidence_001",
        name: "SOC 2 Type II Report - Acme Analytics",
        type: "PDF",
        size: "2.4 MB",
        vendor: {
          id: "vendor_001",
          name: "Acme Analytics"
        },
        control: {
          id: "control_001",
          name: "Access Control",
          framework: "SOC 2"
        },
        status: "Approved",
        uploadedBy: {
          id: "user_001",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com"
        },
        uploadedAt: "2024-01-15T10:00:00Z",
        expiresAt: "2025-01-15T10:00:00Z",
        tags: ["SOC 2", "Security", "Access Control"],
        url: "/evidence/soc2-acme-2024.pdf"
      },
      {
        id: "evidence_002",
        name: "ISO 27001 Certificate - CloudHelper Inc.",
        type: "PDF",
        size: "1.8 MB",
        vendor: {
          id: "vendor_002",
          name: "CloudHelper Inc."
        },
        control: {
          id: "control_002",
          name: "Information Security Management",
          framework: "ISO 27001"
        },
        status: "Under Review",
        uploadedBy: {
          id: "user_002",
          name: "Mike Chen",
          email: "mike.chen@company.com"
        },
        uploadedAt: "2024-01-10T14:30:00Z",
        expiresAt: "2025-01-10T14:30:00Z",
        tags: ["ISO 27001", "Certificate", "Security Management"],
        url: "/evidence/iso27001-cloudhelper-2024.pdf"
      },
      {
        id: "evidence_003",
        name: "GDPR Compliance Statement - SecureMail",
        type: "PDF",
        size: "1.2 MB",
        vendor: {
          id: "vendor_003",
          name: "SecureMail"
        },
        control: {
          id: "control_003",
          name: "Data Protection",
          framework: "GDPR"
        },
        status: "Approved",
        uploadedBy: {
          id: "user_003",
          name: "Emily Davis",
          email: "emily.davis@company.com"
        },
        uploadedAt: "2024-01-20T09:15:00Z",
        expiresAt: "2025-01-20T09:15:00Z",
        tags: ["GDPR", "Compliance", "Data Protection"],
        url: "/evidence/gdpr-securemail-2024.pdf"
      },
      {
        id: "evidence_004",
        name: "Penetration Test Report - DataCorp Solutions",
        type: "PDF",
        size: "3.1 MB",
        vendor: {
          id: "vendor_004",
          name: "DataCorp Solutions"
        },
        control: {
          id: "control_004",
          name: "Vulnerability Management",
          framework: "NIST CSF"
        },
        status: "Pending",
        uploadedBy: {
          id: "user_004",
          name: "David Wilson",
          email: "david.wilson@company.com"
        },
        uploadedAt: "2024-01-25T16:45:00Z",
        expiresAt: "2025-01-25T16:45:00Z",
        tags: ["Penetration Test", "Vulnerability", "Security"],
        url: "/evidence/pentest-datacorp-2024.pdf"
      },
      {
        id: "evidence_005",
        name: "Business Continuity Plan - TechFlow Systems",
        type: "PDF",
        size: "2.8 MB",
        vendor: {
          id: "vendor_005",
          name: "TechFlow Systems"
        },
        control: {
          id: "control_005",
          name: "Business Continuity",
          framework: "ISO 27001"
        },
        status: "Under Review",
        uploadedBy: {
          id: "user_005",
          name: "Lisa Brown",
          email: "lisa.brown@company.com"
        },
        uploadedAt: "2024-01-22T11:30:00Z",
        expiresAt: "2025-01-22T11:30:00Z",
        tags: ["Business Continuity", "Disaster Recovery", "ISO 27001"],
        url: "/evidence/bcp-techflow-2024.pdf"
      }
    ];

    return NextResponse.json({
      success: true,
      data: evidence,
      meta: {
        total: evidence.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Evidence API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, size, vendorId, controlId, tags } = body;

    // Validate required fields
    if (!name || !type || !vendorId || !controlId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new evidence record
    const newEvidence = {
      id: `evidence_${Date.now()}`,
      name,
      type,
      size: size || "0 MB",
      vendor: {
        id: vendorId,
        name: "Demo Vendor"
      },
      control: {
        id: controlId,
        name: "Demo Control",
        framework: "Demo Framework"
      },
      status: "Pending",
      uploadedBy: {
        id: "user_demo",
        name: "Demo User",
        email: "demo@company.com"
      },
      uploadedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: tags || [],
      url: `/evidence/${name.toLowerCase().replace(/\s+/g, '-')}.${type.toLowerCase()}`
    };

    return NextResponse.json({
      success: true,
      data: newEvidence,
      message: 'Evidence uploaded successfully'
    });

  } catch (error) {
    console.error('Upload evidence error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
