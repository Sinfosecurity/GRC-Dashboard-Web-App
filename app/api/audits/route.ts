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

    // Enhanced audit data
    const audits = [
      { 
        name: "SOC 2 Type II", 
        due: "2025-11-30", 
        status: "Planning",
        type: "Compliance",
        auditor: "Deloitte",
        scope: "All systems and processes",
        priority: "High",
        progress: 25,
        lastUpdated: "2024-01-20T10:00:00Z"
      },
      { 
        name: "ISO 27001 Surveillance", 
        due: "2026-02-20", 
        status: "Scheduled",
        type: "Surveillance",
        auditor: "BSI",
        scope: "Information Security Management System",
        priority: "Medium",
        progress: 0,
        lastUpdated: "2024-01-15T14:30:00Z"
      },
      {
        name: "GDPR Compliance Review",
        due: "2024-03-15",
        status: "In Progress",
        type: "Privacy",
        auditor: "Internal",
        scope: "Data processing activities",
        priority: "High",
        progress: 60,
        lastUpdated: "2024-01-22T09:45:00Z"
      }
    ];

    return NextResponse.json({
      success: true,
      data: audits,
      meta: {
        total: audits.length,
        timestamp: new Date().toISOString(),
        user: user.email
      }
    });

  } catch (error) {
    console.error('Audits API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
