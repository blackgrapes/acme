import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportContact from "@/lib/models/SupportContact";

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const contact = await SupportContact.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!contact) {
            return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: contact });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const contact = await SupportContact.findByIdAndDelete(id);

        if (!contact) {
            return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
