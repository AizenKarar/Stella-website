import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ data: blogs });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs" });
    }
}