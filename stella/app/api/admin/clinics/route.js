import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const requestbody = await request.json();
        const newclinic = await prisma.hospital.create({
            data: {
                name: requestbody.name,
                division: requestbody.division,
                city: requestbody.city,
                address: requestbody.address
            }
        });
        return NextResponse.json({ success: true, clinic: newclinic });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}