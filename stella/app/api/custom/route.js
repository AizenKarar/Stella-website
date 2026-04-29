import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const authdata = await auth();
        const clerkid = authdata.userId;
        if (clerkid === null) {
            return Response.json({ error: "unauthorized" });
        }
        const dbuser = await prisma.user.findUnique({
            where: { clerkId: clerkid }
        });
        const currentuser = dbuser.id;
        const body = await request.json();
        const productid = body.productid;
        const description = body.description;
        const product = await prisma.product.findUnique({
            where: { id: productid }
        });
        if (product === null) {
            return Response.json({ error: "not found" });
        }
        const finalprice = product.price + 100;
        await prisma.customRequest.create({
            data: {
                clerkId: currentuser,
                productId: productid,
                description: description,
                totalPrice: finalprice
            }
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "failed" });
    }
}