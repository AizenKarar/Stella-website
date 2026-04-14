import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();
export async function GET() {
    try {
        const hospitals = await prisma.hospital.findMany({
            include: {
                doctors: true,
            },
        });
        return NextResponse.json(hospitals);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch hospitals" });
    }
}