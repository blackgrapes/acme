import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ContactSubmission } from "@/lib/db";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    // Auto-determine priority based on subject/content
    let priority = "Medium";
    const urgentKeywords = [
      "urgent",
      "immediate",
      "emergency",
      "asap",
      "critical",
    ];
    const subject = data.subject.toLowerCase();
    const message = data.message.toLowerCase();

    if (
      urgentKeywords.some(
        (keyword) => subject.includes(keyword) || message.includes(keyword)
      )
    ) {
      priority = "High";
    }

    // Auto-categorize based on content
    let category = "General Inquiry";
    if (
      subject.includes("quote") ||
      subject.includes("pricing") ||
      subject.includes("rate")
    ) {
      category = "Service Inquiry";
    } else if (
      subject.includes("feedback") ||
      subject.includes("review") ||
      subject.includes("performance")
    ) {
      category = "Feedback";
    } else if (
      subject.includes("document") ||
      subject.includes("certificate") ||
      subject.includes("license")
    ) {
      category = "Documentation";
    } else if (
      subject.includes("complaint") ||
      subject.includes("issue") ||
      subject.includes("problem")
    ) {
      category = "Complaint";
    }

    const submission = await ContactSubmission.create({
      ...data,
      priority,
      category,
      status: "New",
      read: false,
    });

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
