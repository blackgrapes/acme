// File: /src/app/api/admin/requests/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DocumentRequest from "@/lib/models/DocumentRequest";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import mongoose from "mongoose";
import { 
  verifyTokenFromRequest, 
  getCurrentUser 
} from "@/lib/auth";

// Helper function to check permissions
async function checkUserPermissions(request, requiredPermission) {
  try {
    // Verify token and get user
    const user = await getCurrentUser(request);
    
    console.log("User in checkUserPermissions:", user);
    
    if (!user) {
      return { 
        success: false, 
        error: "Unauthorized", 
        status: 401 
      };
    }

    // Debug: Check user and role structure
    console.log("User role:", user.role);
    console.log("User role type:", typeof user.role);

    // If role is an ObjectId (not populated), fetch the role
    let userRole;
    if (user.role && typeof user.role === 'object' && user.role._id) {
      // Role is already populated
      userRole = user.role;
    } else if (user.role) {
      // Role is an ObjectId, fetch it
      userRole = await Role.findById(user.role);
    }

    console.log("User role object:", userRole);

    if (!userRole) {
      return { 
        success: false, 
        error: "Role not found", 
        status: 403 
      };
    }

    // Check if role name is "Super Admin" (bypass permission check)
    if (userRole.name === "Super Admin" || userRole.name === "admin") {
      console.log("User is Super Admin, allowing access");
      return { 
        success: true, 
        user 
      };
    }

    // Check if user has the required permission
    const hasPermission = userRole.permissions && userRole.permissions.includes(requiredPermission);
    
    if (!hasPermission) {
      console.log(`User lacks permission: ${requiredPermission}`);
      console.log("User permissions:", userRole.permissions);
      return { 
        success: false, 
        error: "Insufficient permissions", 
        status: 403 
      };
    }

    return { 
      success: true, 
      user 
    };
  } catch (error) {
    console.error("Permission check error:", error);
    return { 
      success: false, 
      error: "Internal server error", 
      status: 500 
    };
  }
}

// GET: Fetch all document requests with filters
export async function GET(request) {
  try {
    // Check permissions
    const permissionCheck = await checkUserPermissions(request, "requests-read");
    if (!permissionCheck.success) {
      console.log("GET request permission check failed:", permissionCheck.error);
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const clientId = searchParams.get("clientId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "-createdAt";
    const search = searchParams.get("search");

    // Build query
    let query = {};

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Document type filter
    if (type && type !== "all") {
      query.documentType = type;
    }

    // Priority filter
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    // Client filter
    if (clientId) {
      query.clientId = new mongoose.Types.ObjectId(clientId);
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { clientEmail: { $regex: search, $options: "i" } },
        { documentName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { clientCompany: { $regex: search, $options: "i" } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination and sorting
    const requests = await DocumentRequest.find(query)
      .populate("clientId", "name email company")
      .populate("assignedTo", "name email")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await DocumentRequest.countDocuments(query);

    // Get statistics
    const stats = {
      total: await DocumentRequest.countDocuments(),
      pending: await DocumentRequest.countDocuments({ status: "pending" }),
      "in-progress": await DocumentRequest.countDocuments({ status: "in-progress" }),
      completed: await DocumentRequest.countDocuments({ status: "completed" }),
      rejected: await DocumentRequest.countDocuments({ status: "rejected" }),
      cancelled: await DocumentRequest.countDocuments({ status: "cancelled" }),
      urgent: await DocumentRequest.countDocuments({ 
        $or: [
          { priority: "urgent", status: { $in: ["pending", "in-progress"] } },
          { isUrgent: true, status: { $in: ["pending", "in-progress"] } }
        ]
      }),
      high: await DocumentRequest.countDocuments({ 
        priority: "high", 
        status: { $in: ["pending", "in-progress"] } 
      })
    };

    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    });

  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

// POST: Create a new document request (for admin on behalf of client)
export async function POST(request) {
  try {
    // Check permissions
    const permissionCheck = await checkUserPermissions(request, "requests-create");
    if (!permissionCheck.success) {
      console.log("POST request permission check failed:", permissionCheck.error);
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    console.log("Permission check passed, user:", permissionCheck.user.email);
    
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["clientId", "documentName", "documentType"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Get client details
    const client = await User.findById(body.clientId);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Create request with requesting admin/user info
    const newRequest = new DocumentRequest({
      clientId: body.clientId,
      clientName: client.name,
      clientEmail: client.email,
      clientCompany: client.company || "",
      documentName: body.documentName,
      documentType: body.documentType,
      description: body.description || "",
      priority: body.priority || "medium",
      requiredBy: body.requiredBy || null,
      status: "pending",
      assignedTo: body.assignedTo || permissionCheck.user._id,
      adminNotes: body.adminNotes || "",
      response: body.response || "",
      isUrgent: body.priority === "urgent" || false,
      attachments: body.attachments || [],
      requestDate: new Date(),
      requestedBy: permissionCheck.user._id
    });

    await newRequest.save();

    // Populate for response
    const populatedRequest = await DocumentRequest.findById(newRequest._id)
      .populate("clientId", "name email company")
      .populate("assignedTo", "name email")
      .populate("requestedBy", "name email");

    return NextResponse.json({
      success: true,
      message: "Document request created successfully",
      request: populatedRequest
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

// PUT: Update a document request
export async function PUT(request) {
  try {
    console.log("PUT request received for updating document request");
    
    // Check permissions
    const permissionCheck = await checkUserPermissions(request, "requests-update");
    if (!permissionCheck.success) {
      console.log("PUT request permission check failed:", permissionCheck.error);
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    console.log("Permission check passed, user:", permissionCheck.user.email);
    
    await connectDB();

    const body = await request.json();
    console.log("Request body:", body);
    
    if (!body.requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Find the request
    const existingRequest = await DocumentRequest.findById(body.requestId);
    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    console.log("Existing request found:", existingRequest._id);
    
    // Check if user can update this request
    // For Super Admin, allow all updates
    // For others, check if they are assigned to this request
    let userRole;
    if (permissionCheck.user.role && typeof permissionCheck.user.role === 'object' && permissionCheck.user.role._id) {
      userRole = permissionCheck.user.role;
    } else if (permissionCheck.user.role) {
      userRole = await Role.findById(permissionCheck.user.role);
    }

    const isSuperAdmin = userRole && (userRole.name === "Super Admin" || userRole.name === "admin");
    
    const canUpdate = 
      isSuperAdmin ||
      (existingRequest.assignedTo && 
       existingRequest.assignedTo.toString() === permissionCheck.user._id.toString());

    if (!canUpdate) {
      console.log("User not authorized to update this request");
      console.log("User ID:", permissionCheck.user._id);
      console.log("Assigned to:", existingRequest.assignedTo);
      console.log("Is Super Admin:", isSuperAdmin);
      
      return NextResponse.json(
        { error: "You are not authorized to update this request" },
        { status: 403 }
      );
    }

    console.log("User authorized to update, proceeding...");
    
    // Prepare update data
    const updateData = {};
    
    // Allowed fields to update
    const allowedFields = [
      "status", "adminNotes", "assignedTo", "response", 
      "priority", "description", "completedDate", "isUrgent"
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // If status changed to completed, set completedDate
    if (body.status === "completed" && existingRequest.status !== "completed") {
      updateData.completedDate = new Date();
    }

    // Update the request
    const updatedRequest = await DocumentRequest.findByIdAndUpdate(
      body.requestId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate("clientId", "name email company")
    .populate("assignedTo", "name email");

    console.log("Request updated successfully:", updatedRequest._id);

    return NextResponse.json({
      success: true,
      message: "Request updated successfully",
      request: updatedRequest
    });

  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a document request
export async function DELETE(request) {
  try {
    console.log("DELETE request received for deleting document request");
    
    // Check permissions
    const permissionCheck = await checkUserPermissions(request, "requests-delete");
    if (!permissionCheck.success) {
      console.log("DELETE request permission check failed:", permissionCheck.error);
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    console.log("Permission check passed, user:", permissionCheck.user.email);
    
    await connectDB();

    // Get request ID from query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Check if the request exists
    const existingRequest = await DocumentRequest.findById(id);
    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    console.log("Existing request found:", existingRequest._id);
    
    // Check if user can delete this request
    // For Super Admin, allow all deletions
    // For others, check if they are assigned to this request or created it
    let userRole;
    if (permissionCheck.user.role && typeof permissionCheck.user.role === 'object' && permissionCheck.user.role._id) {
      userRole = permissionCheck.user.role;
    } else if (permissionCheck.user.role) {
      userRole = await Role.findById(permissionCheck.user.role);
    }

    const isSuperAdmin = userRole && (userRole.name === "Super Admin" || userRole.name === "admin");
    
    const canDelete = 
      isSuperAdmin ||
      (existingRequest.assignedTo && 
       existingRequest.assignedTo.toString() === permissionCheck.user._id.toString()) ||
      (existingRequest.requestedBy && 
       existingRequest.requestedBy.toString() === permissionCheck.user._id.toString());

    if (!canDelete) {
      console.log("User not authorized to delete this request");
      console.log("User ID:", permissionCheck.user._id);
      console.log("Assigned to:", existingRequest.assignedTo);
      console.log("Requested by:", existingRequest.requestedBy);
      console.log("Is Super Admin:", isSuperAdmin);
      
      return NextResponse.json(
        { error: "You are not authorized to delete this request" },
        { status: 403 }
      );
    }

    console.log("User authorized to delete, proceeding...");
    
    // Delete the request
    const deletedRequest = await DocumentRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { error: "Request not found or already deleted" },
        { status: 404 }
      );
    }

    console.log("Request deleted successfully:", id);

    return NextResponse.json({
      success: true,
      message: "Document request deleted successfully",
      deletedId: id
    });

  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}