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

    const tasks = [
      {
        id: "task_001",
        title: "Security Assessment Review",
        description: "Review and validate security assessment for Acme Analytics",
        status: "In Progress",
        priority: "High",
        assignee: {
          id: "user_001",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com"
        },
        vendor: {
          id: "vendor_001",
          name: "Acme Analytics"
        },
        dueDate: "2024-02-15T10:00:00Z",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        tags: ["Security", "Assessment", "Review"]
      },
      {
        id: "task_002",
        title: "Compliance Documentation",
        description: "Gather and organize compliance documentation for CloudHelper Inc.",
        status: "Pending",
        priority: "Medium",
        assignee: {
          id: "user_002",
          name: "Mike Chen",
          email: "mike.chen@company.com"
        },
        vendor: {
          id: "vendor_002",
          name: "CloudHelper Inc."
        },
        dueDate: "2024-02-20T14:00:00Z",
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-18T11:15:00Z",
        tags: ["Compliance", "Documentation"]
      },
      {
        id: "task_003",
        title: "Risk Assessment Update",
        description: "Update risk assessment for SecureMail based on new findings",
        status: "Completed",
        priority: "Low",
        assignee: {
          id: "user_003",
          name: "Emily Davis",
          email: "emily.davis@company.com"
        },
        vendor: {
          id: "vendor_003",
          name: "SecureMail"
        },
        dueDate: "2024-01-25T16:00:00Z",
        createdAt: "2024-01-05T08:00:00Z",
        updatedAt: "2024-01-25T15:45:00Z",
        tags: ["Risk", "Assessment", "Update"]
      },
      {
        id: "task_004",
        title: "Contract Renewal",
        description: "Initiate contract renewal process for DataCorp Solutions",
        status: "In Progress",
        priority: "High",
        assignee: {
          id: "user_004",
          name: "David Wilson",
          email: "david.wilson@company.com"
        },
        vendor: {
          id: "vendor_004",
          name: "DataCorp Solutions"
        },
        dueDate: "2024-03-01T12:00:00Z",
        createdAt: "2024-01-20T10:30:00Z",
        updatedAt: "2024-01-22T09:15:00Z",
        tags: ["Contract", "Renewal", "Legal"]
      },
      {
        id: "task_005",
        title: "Security Audit",
        description: "Conduct comprehensive security audit for TechFlow Systems",
        status: "Pending",
        priority: "Critical",
        assignee: {
          id: "user_005",
          name: "Lisa Brown",
          email: "lisa.brown@company.com"
        },
        vendor: {
          id: "vendor_005",
          name: "TechFlow Systems"
        },
        dueDate: "2024-02-10T09:00:00Z",
        createdAt: "2024-01-25T14:20:00Z",
        updatedAt: "2024-01-25T14:20:00Z",
        tags: ["Security", "Audit", "Critical"]
      }
    ];

    return NextResponse.json({
      success: true,
      data: tasks,
      meta: {
        total: tasks.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Tasks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, assigneeId, vendorId, dueDate, tags } = body;

    // Validate required fields
    if (!title || !description || !priority || !assigneeId || !vendorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = {
      id: `task_${Date.now()}`,
      title,
      description,
      status: "Pending",
      priority,
      assignee: {
        id: assigneeId,
        name: "Demo User",
        email: "demo@company.com"
      },
      vendor: {
        id: vendorId,
        name: "Demo Vendor"
      },
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || []
    };

    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
