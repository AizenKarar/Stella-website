import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const userid = "4976ff87-d687-459d-84f4-d1965b343cf9";
        const body = await request.json();
        const shippingaddress = body.address;
        const cartitems = await prisma.cartItem.findMany({
            where: {
                userid: userid
            },
            include: {
                product: true
            }
        });
        if (cartitems.length === 0) {
            return Response.json({ error: "empty cart" });
        }
        let totalamount = 0;
        for (let i = 0; i < cartitems.length; i = i + 1) {
            let itemprice = cartitems[i].product.price;
            let itemquantity = cartitems[i].quantity;
            totalamount = totalamount + (itemprice * itemquantity);
        }
        const neworder = await prisma.order.create({
            data: {
                userId: userid,
                totalAmount: totalamount,
                shippingAddress: shippingaddress,
                status: "PENDING"
            }
        });
        for (let i = 0; i < cartitems.length; i = i + 1) {
            await prisma.orderItem.create({
                data: {
                    orderId: neworder.id,
                    productId: cartitems[i].product.id,
                    quantity: cartitems[i].quantity,
                    price: cartitems[i].product.price
                }
            });
        }
        await prisma.cartItem.deleteMany({
            where: {
                userid: userid
            }
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "failed" });
    }
}