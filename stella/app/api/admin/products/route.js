import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const requestbody = await request.json();
        const newproduct = await prisma.product.create({
            data: {
                name: requestbody.name,
                description: requestbody.description,
                price: parseFloat(requestbody.price),
                stock: parseInt(requestbody.stock),
                imageUrl: requestbody.imageurl,
                animalType: requestbody.animaltype,
                category: requestbody.category
            }
        });
        return NextResponse.json({ success: true, product: newproduct });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}