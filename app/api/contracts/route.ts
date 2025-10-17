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

    // Enhanced contract data
    const contracts = [
      {
        id: "contract_001",
        name: "Acme Analytics - Data Processing Agreement",
        type: "DPA",
        vendorId: "vendor_001",
        vendorName: "Acme Analytics",
        businessServiceId: "bs_001",
        businessServiceName: "Customer Analytics Platform",
        
        // Contract Details
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2025-12-31T23:59:59Z",
        renewalDate: "2025-10-01T00:00:00Z",
        autoRenewal: true,
        value: 150000,
        currency: "USD",
        
        // Legal & Compliance
        dataProcessingAgreement: true,
        standardContractualClauses: true,
        dataResidency: "EU",
        transferMechanisms: ["SCCs", "Adequacy Decision"],
        
        // Status
        status: "Active",
        version: "2.1",
        
        // Alerts
        renewalAlerts: [
          {
            daysBefore: 90,
            sent: false,
            sentAt: null
          },
          {
            daysBefore: 30,
            sent: false,
            sentAt: null
          }
        ],
        
        // Documents
        documents: [
          {
            id: "doc_001",
            name: "DPA_Acme_Analytics_v2.1.pdf",
            type: "PDF",
            size: 2048576,
            uploadedAt: "2024-01-01T10:00:00Z"
          }
        ],
        
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T14:30:00Z"
      },
      {
        id: "contract_002",
        name: "CloudHelper Inc. - Service Level Agreement",
        type: "SLA",
        vendorId: "vendor_002",
        vendorName: "CloudHelper Inc.",
        businessServiceId: "bs_002",
        businessServiceName: "Cloud Infrastructure",
        
        // Contract Details
        startDate: "2024-02-01T00:00:00Z",
        endDate: "2025-01-31T23:59:59Z",
        renewalDate: "2024-11-01T00:00:00Z",
        autoRenewal: false,
        value: 500000,
        currency: "USD",
        
        // Legal & Compliance
        dataProcessingAgreement: false,
        standardContractualClauses: false,
        dataResidency: "US",
        transferMechanisms: ["Adequacy Decision"],
        
        // Status
        status: "Active",
        version: "1.0",
        
        // Alerts
        renewalAlerts: [
          {
            daysBefore: 60,
            sent: true,
            sentAt: "2024-10-01T09:00:00Z"
          },
          {
            daysBefore: 30,
            sent: false,
            sentAt: null
          }
        ],
        
        // Documents
        documents: [
          {
            id: "doc_002",
            name: "SLA_CloudHelper_v1.0.pdf",
            type: "PDF",
            size: 1536000,
            uploadedAt: "2024-02-01T14:00:00Z"
          }
        ],
        
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-01-20T16:45:00Z"
      },
      {
        id: "contract_003",
        name: "SecureMail - Master Service Agreement",
        type: "MSA",
        vendorId: "vendor_003",
        vendorName: "SecureMail",
        businessServiceId: "bs_003",
        businessServiceName: "Secure Communications",
        
        // Contract Details
        startDate: "2023-06-01T00:00:00Z",
        endDate: "2024-05-31T23:59:59Z",
        renewalDate: "2024-03-01T00:00:00Z",
        autoRenewal: true,
        value: 75000,
        currency: "USD",
        
        // Legal & Compliance
        dataProcessingAgreement: true,
        standardContractualClauses: true,
        dataResidency: "EU",
        transferMechanisms: ["SCCs", "Binding Corporate Rules"],
        
        // Status
        status: "Expired",
        version: "3.2",
        
        // Alerts
        renewalAlerts: [
          {
            daysBefore: 90,
            sent: true,
            sentAt: "2024-02-01T09:00:00Z"
          },
          {
            daysBefore: 30,
            sent: true,
            sentAt: "2024-04-01T09:00:00Z"
          }
        ],
        
        // Documents
        documents: [
          {
            id: "doc_003",
            name: "MSA_SecureMail_v3.2.pdf",
            type: "PDF",
            size: 3072000,
            uploadedAt: "2023-06-01T11:00:00Z"
          },
          {
            id: "doc_004",
            name: "DPA_SecureMail_Amendment.pdf",
            type: "PDF",
            size: 1024000,
            uploadedAt: "2023-08-15T15:30:00Z"
          }
        ],
        
        createdAt: "2023-06-01T00:00:00Z",
        updatedAt: "2024-05-31T23:59:59Z"
      }
    ];

    return NextResponse.json({
      success: true,
      data: contracts,
      meta: {
        total: contracts.length,
        timestamp: new Date().toISOString(),
        user: 'demo@example.com'
      }
    });

  } catch (error) {
    console.error('Contracts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) {
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

    const body = await request.json();
    const { name, type, vendorId, businessServiceId, startDate, endDate, value, currency } = body;

    // Validate required fields
    if (!name || !type || !vendorId || !businessServiceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new contract
    const newContract = {
      id: `contract_${Date.now()}`,
      name,
      type,
      vendorId,
      businessServiceId,
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      renewalDate: endDate ? new Date(new Date(endDate).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString() : new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenewal: false,
      value: value || 0,
      currency: currency || "USD",
      dataProcessingAgreement: type === "DPA",
      standardContractualClauses: false,
      dataResidency: "US",
      transferMechanisms: [],
      status: "Draft",
      version: "1.0",
      renewalAlerts: [
        {
          daysBefore: 90,
          sent: false,
          sentAt: null
        },
        {
          daysBefore: 30,
          sent: false,
          sentAt: null
        }
      ],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newContract,
      message: 'Contract created successfully'
    });

  } catch (error) {
    console.error('Create contract error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
