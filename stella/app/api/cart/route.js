import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
    try {
        const currentuser = "4976ff87-d687-459d-84f4-d1965b343cf9";
        const cartitems = await prisma.cartItem.findMany({
            where: { userid: currentuser },
            include: { product: true }
        });
        return Response.json(cartitems);
    } catch (error) {
        console.log("cart get error:", error);
        return Response.json({ error: "failed" }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const currentuser = "4976ff87-d687-459d-84f4-d1965b343cf9";
        const body = await request.json();
        const selectedproduct = body.productid;
        const iscustom = body.iscustom || false;
        const customnote = body.customnote || "";

        if (iscustom === true) {
            await prisma.cartItem.create({
                data: {
                    userid: currentuser,
                    productid: selectedproduct,
                    quantity: 1,
                    isCustom: true,
                    customNote: customnote
                }
            });
        } else {
            const existing = await prisma.cartItem.findFirst({
                where: { userid: currentuser, productid: selectedproduct, isCustom: false }
            });

            if (existing) {
                await prisma.cartItem.update({
                    where: { id: existing.id },
                    data: { quantity: existing.quantity + 1 }
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        userid: currentuser,
                        productid: selectedproduct,
                        quantity: 1,
                        isCustom: false
                    }
                });
            }
        }
        return Response.json({ success: true });
    } catch (error) {
        console.log("cart post error:", error);
        return Response.json({ error: "failed" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const itemid = body.itemid;
        const newquantity = body.quantity;

        if (newquantity <= 0) {
            return Response.json({ error: "invalid quantity" }, { status: 400 });
        }

        await prisma.cartItem.update({
            where: { id: itemid },
            data: { quantity: newquantity }
        });

        return Response.json({ success: true });
    } catch (error) {
        console.log("cart put error:", error);
        return Response.json({ error: "failed" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const itemid = body.itemid;

        await prisma.cartItem.delete({
            where: { id: itemid }
        });

        return Response.json({ success: true });
    } catch (error) {
        console.log("cart delete error:", error);
        return Response.json({ error: "failed" }, { status: 500 });
    }
}