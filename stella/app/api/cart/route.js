import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
    try {
        const mycart = await prisma.cartItem.findMany({
            where: {
                userid: "4976ff87-d687-459d-84f4-d1965b343cf9"
            },
            include: {
                product: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return Response.json(mycart);
    } catch (error) {
        return Response.json([]);
    }
}
export async function POST(request) {
    try {
        const body = await request.json();
        const existingitem = await prisma.cartItem.findFirst({
            where: {
                userid: "4976ff87-d687-459d-84f4-d1965b343cf9",
                productid: body.productid
            }
        });
        if (existingitem !== null) {
            const updateditem = await prisma.cartItem.update({
                where: {
                    id: existingitem.id
                },
                data: {
                    quantity: existingitem.quantity + 1
                }
            });
            return Response.json(updateditem);
        } else {
            const newitem = await prisma.cartItem.create({
                data: {
                    userid: "4976ff87-d687-459d-84f4-d1965b343cf9",
                    productid: body.productid,
                    quantity: 1
                }
            });
            return Response.json(newitem);
        }
    } catch (error) {
        return Response.json({ error: "failed" });
    }
}
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const itemid = url.searchParams.get("id");
        await prisma.cartItem.delete({
            where: {
                id: itemid
            }
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "failed" });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const existingitem = await prisma.cartItem.findFirst({
            where: {
                id: body.cartitemid
            }
        });
        let newquantity = existingitem.quantity;
        if (body.action === "increase") {
            newquantity = newquantity + 1;
        }
        if (body.action === "decrease") {
            newquantity = newquantity - 1;
        }

        if (newquantity <= 0) {
            await prisma.cartItem.delete({
                where: {
                    id: body.cartitemid
                }
            });
        } else {
            await prisma.cartItem.update({
                where: {
                    id: body.cartitemid
                },
                data: {
                    quantity: newquantity
                }
            });
        }
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "failed" });
    }
}