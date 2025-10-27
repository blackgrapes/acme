import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ContactSubmission } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const submissions = await ContactSubmission.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
