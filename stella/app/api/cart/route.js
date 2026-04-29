import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();
export async function GET() {
    try {
        const authdata = await auth();
        const clerkid = authdata.userId;
        if (clerkid === null) {
            return NextResponse.json({ error: "unauthorized" });
        }
        const dbuser = await prisma.user.findUnique({
            where: { clerkId: clerkid }
        });
        const currentuser = dbuser.id;
        const cartitems = await prisma.cartItem.findMany({
            where: { userid: currentuser },
            include: { product: true }
        });
        return NextResponse.json(cartitems);
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}
export async function POST(request) {
    try {
        const authdata = await auth();
        const clerkid = authdata.userId;
        if (clerkid === null) {
            return NextResponse.json({ error: "unauthorized" });
        }
        const dbuser = await prisma.user.findUnique({
            where: { clerkId: clerkid }
        });
        const currentuser = dbuser.id;
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
            if (existing !== null) {
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
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}
export async function PUT(request) {
    try {
        const body = await request.json();
        const itemid = body.itemid;
        const newquantity = body.quantity;
        if (newquantity <= 0) {
            return NextResponse.json({ error: "invalid quantity" });
        }
        await prisma.cartItem.update({
            where: { id: itemid },
            data: { quantity: newquantity }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}
export async function DELETE(request) {
    try {
        const body = await request.json();
        const itemid = body.itemid;
        await prisma.cartItem.delete({
            where: { id: itemid }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "failed" });
    }
}