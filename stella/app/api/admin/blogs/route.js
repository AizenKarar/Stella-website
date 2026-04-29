import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const requestbody = await request.json();
        const blogslug = requestbody.title.toLowerCase().split(" ").join("-") + "-" + Date.now().toString();
        const newblog = await prisma.blog.create({
            data: {
                title: requestbody.title,
                slug: blogslug,
                content: requestbody.content,
                author: requestbody.author,
                imageUrl: requestbody.imageurl,
                published: true
            }
        });
        return NextResponse.json({ success: true, blog: newblog });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}