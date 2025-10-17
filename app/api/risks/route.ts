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

    // Mock data with enhanced structure
    const risks = [
      { 
        id: "R-101", 
        title: "S3 bucket public listing", 
        owner: "Alice", 
        inherent: 78, 
        residual: 68, 
        status: "Open", 
        tags: ["Confidentiality", "Cloud"],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:45:00Z",
        priority: "High",
        category: "Data Security"
      },
      { 
        id: "R-205", 
        title: "Third-party lacks SOC 2", 
        owner: "Raj", 
        inherent: 83, 
        residual: 72, 
        status: "Open", 
        tags: ["Vendor", "Privacy"],
        createdAt: "2024-01-10T09:15:00Z",
        updatedAt: "2024-01-18T11:20:00Z",
        priority: "Critical",
        category: "Vendor Risk"
      },
      { 
        id: "R-233", 
        title: "Prod access without MFA", 
        owner: "Mina", 
        inherent: 70, 
        residual: 55, 
        status: "Mitigating", 
        tags: ["Identity", "Access"],
        createdAt: "2024-01-12T16:00:00Z",
        updatedAt: "2024-01-19T13:30:00Z",
        priority: "High",
        category: "Access Control"
      },
      { 
        id: "R-310", 
        title: "Shadow SaaS discovery", 
        owner: "Leo", 
        inherent: 64, 
        residual: 48, 
        status: "Open", 
        tags: ["Asset", "SaaS"],
        createdAt: "2024-01-08T14:20:00Z",
        updatedAt: "2024-01-17T10:15:00Z",
        priority: "Medium",
        category: "Asset Management"
      }
    ];

    return NextResponse.json({
      success: true,
      data: risks,
      meta: {
        total: risks.length,
        timestamp: new Date().toISOString(),
        user: user.email
      }
    });

  } catch (error) {
    console.error('Risks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
