import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const blogId = resolvedParams.id;

        const blog = await prisma.blog.findUnique({
            where: { id: blogId }
        });

        return NextResponse.json({ data: blog }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}