import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ContactSubmission } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const data = await request.json();

    const submission = await ContactSubmission.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
