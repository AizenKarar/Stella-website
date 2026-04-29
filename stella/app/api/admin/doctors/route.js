import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const requestbody = await request.json();
        const newdoctor = await prisma.doctor.create({
            data: {
                name: requestbody.name,
                specialty: requestbody.specialty,
                hospitalId: requestbody.hospitalid
            }
        });
        return NextResponse.json({ success: true, doctor: newdoctor });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}