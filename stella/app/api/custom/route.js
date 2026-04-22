import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const userid = "4976ff87-d687-459d-84f4-d1965b343cf9";
        const body = await request.json();
        const productid = body.productid;
        const description = body.description;
        const product = await prisma.product.findUnique({
            where: { id: productid }
        });
        if (product === null) {
            return Response.json({ error: "product not found" });
        }
        const finalprice = product.price + 100;
        await prisma.customRequest.create({
            data: {
                clerkId: userid,
                productId: productid,
                description: description,
                totalPrice: finalprice
            }
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "failed to save" });
    }
}