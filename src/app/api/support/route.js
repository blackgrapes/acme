import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportContact from "@/lib/models/SupportContact";

export async function GET() {
    await dbConnect();

    try {
        const contacts = await SupportContact.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: contacts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();
        const contact = await SupportContact.create(body);
        return NextResponse.json({ success: true, data: contact }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
