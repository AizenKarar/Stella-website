import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();
export async function GET(request) {
    try {
        const searchparams = request.nextUrl.searchParams;
        const categoryparam = searchparams.get("category");
        const animalparam = searchparams.get("animal");
        let databaserules = {};
        if (categoryparam !== null) {
            databaserules.category = categoryparam;
        }
        if (animalparam !== null && animalparam !== "ALL") {
            databaserules.animalType = animalparam;
        }
        const products = await prisma.product.findMany({
            where: databaserules
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" });
    }
}