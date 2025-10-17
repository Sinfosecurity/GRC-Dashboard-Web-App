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

    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Enhanced vendor data
    const vendors = [
      { 
        name: "Acme Analytics", 
        score: 72, 
        tier: 2, 
        redFlags: 1,
        category: "Analytics",
        lastAssessment: "2024-01-15T10:00:00Z",
        nextReview: "2024-04-15T10:00:00Z",
        status: "Active",
        compliance: ["SOC 2", "GDPR"],
        riskLevel: "Medium"
      },
      { 
        name: "CloudHelper Inc.", 
        score: 58, 
        tier: 3, 
        redFlags: 3,
        category: "Cloud Services",
        lastAssessment: "2024-01-10T14:30:00Z",
        nextReview: "2024-02-10T14:30:00Z",
        status: "Under Review",
        compliance: ["ISO 27001"],
        riskLevel: "High"
      },
      { 
        name: "SecureMail", 
        score: 84, 
        tier: 1, 
        redFlags: 0,
        category: "Communication",
        lastAssessment: "2024-01-20T09:15:00Z",
        nextReview: "2024-07-20T09:15:00Z",
        status: "Approved",
        compliance: ["SOC 2", "ISO 27001", "GDPR"],
        riskLevel: "Low"
      }
    ];

    return NextResponse.json({
      success: true,
      data: vendors,
      meta: {
        total: vendors.length,
        timestamp: new Date().toISOString(),
        user: user.email
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
