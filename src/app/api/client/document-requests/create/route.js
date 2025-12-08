// File: src/app/api/client/document-requests/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DocumentRequest from "@/lib/models/DocumentRequest";
import User from "@/lib/models/User";
import { getCurrentUser, hasRole } from "@/lib/auth";

// POST - Create new document request
export async function POST(request) {
  try {
    await connectDB();

    // Get current user (client)
    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const clientId = user._id;
    const body = await request.json();

    // Validate required fields
    const { documentName, documentType, description, priority, requiredBy } = body;

    if (!documentName || !documentType) {
      return NextResponse.json(
        { error: "Document name and type are required" },
        { status: 400 }
      );
    }

    // Create new document request
    const documentRequest = new DocumentRequest({
      clientId,
      clientName: user.name,
      clientEmail: user.email,
      clientCompany: user.companyName || "",
      documentName,
      documentType,
      description: description || "",
      priority: priority || "medium",
      requiredBy: requiredBy ? new Date(requiredBy) : null,
      status: "pending",
      requestDate: new Date(),
      isUrgent: priority === "urgent",
    });

    await documentRequest.save();

    // You can add email notification to admin here if needed

    return NextResponse.json({
      success: true,
      message: "Document request submitted successfully",
      data: {
        _id: documentRequest._id,
        documentName: documentRequest.documentName,
        documentType: documentRequest.documentType,
        status: documentRequest.status,
        requestDate: documentRequest.requestDate,
      }
    });

  } catch (error) {
    console.error("❌ Error creating document request:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit document request",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Fetch document requests for the current client
export async function GET(request) {
  try {
    await connectDB();

    // Get current user (client)
    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, in_progress, completed, cancelled
    const priority = searchParams.get('priority'); // low, medium, high, urgent
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || '-requestDate'; // - for descending
    const documentType = searchParams.get('documentType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter object
    const filter = { clientId: user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (documentType) filter.documentType = documentType;

    // Date range filter
    if (startDate || endDate) {
      filter.requestDate = {};
      if (startDate) filter.requestDate.$gte = new Date(startDate);
      if (endDate) filter.requestDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await DocumentRequest.countDocuments(filter);

    // Fetch document requests with pagination and sorting
    const documentRequests = await DocumentRequest.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select('-__v') // Exclude version key
      .lean();

    // Transform data for frontend
    const transformedRequests = documentRequests.map(request => ({
      id: request._id.toString(),
      documentName: request.documentName,
      documentType: request.documentType,
      description: request.description,
      priority: request.priority,
      status: request.status,
      isUrgent: request.isUrgent || false,
      requiredBy: request.requiredBy,
      requestDate: request.requestDate,
      clientName: request.clientName,
      clientEmail: request.clientEmail,
      clientCompany: request.clientCompany,
      adminNotes: request.adminNotes || null,
      completedDate: request.completedDate || null,
      estimatedCompletionDate: request.estimatedCompletionDate || null,
    }));

    return NextResponse.json({
      success: true,
      data: transformedRequests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
      filters: {
        status,
        priority,
        documentType,
        startDate,
        endDate,
        sortBy,
      },
    });

  } catch (error) {
    console.error("❌ Error fetching document requests:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch document requests",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// OPTIONAL: PUT - Update document request (if client needs to update)
export async function PUT(request) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');
    const body = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Document request ID is required" },
        { status: 400 }
      );
    }

    // Find the document request
    const documentRequest = await DocumentRequest.findOne({
      _id: requestId,
      clientId: user._id,
      status: { $in: ['pending', 'in_progress'] } // Only allow updates for certain statuses
    });

    if (!documentRequest) {
      return NextResponse.json(
        { error: "Document request not found or cannot be updated" },
        { status: 404 }
      );
    }

    // Fields that can be updated by client
    const updatableFields = ['description', 'priority', 'requiredBy'];
    let hasUpdates = false;

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        documentRequest[field] = body[field];
        hasUpdates = true;
      }
    }

    // Update isUrgent based on priority
    if (body.priority) {
      documentRequest.isUrgent = body.priority === 'urgent';
    }

    if (hasUpdates) {
      documentRequest.updatedAt = new Date();
      await documentRequest.save();
    }

    return NextResponse.json({
      success: true,
      message: "Document request updated successfully",
      data: {
        id: documentRequest._id,
        documentName: documentRequest.documentName,
        status: documentRequest.status,
        updatedAt: documentRequest.updatedAt,
      }
    });

  } catch (error) {
    console.error("❌ Error updating document request:", error);
    return NextResponse.json(
      { 
        error: "Failed to update document request",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// OPTIONAL: DELETE - Cancel document request
export async function DELETE(request) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');

    if (!requestId) {
      return NextResponse.json(
        { error: "Document request ID is required" },
        { status: 400 }
      );
    }

    // Find and update status to cancelled
    const documentRequest = await DocumentRequest.findOneAndUpdate(
      {
        _id: requestId,
        clientId: user._id,
        status: { $in: ['pending', 'in_progress'] } // Only allow cancellation for certain statuses
      },
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!documentRequest) {
      return NextResponse.json(
        { error: "Document request not found or cannot be cancelled" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document request cancelled successfully",
      data: {
        id: documentRequest._id,
        documentName: documentRequest.documentName,
        status: documentRequest.status,
        cancelledAt: documentRequest.cancelledAt,
      }
    });

  } catch (error) {
    console.error("❌ Error cancelling document request:", error);
    return NextResponse.json(
      { 
        error: "Failed to cancel document request",
        details: error.message 
      },
      { status: 500 }
    );
  }
}