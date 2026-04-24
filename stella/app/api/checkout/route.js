import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request) {
    try {
        const userid = "4976ff87-d687-459d-84f4-d1965b343cf9";
        const body = await request.json();
        const shippingaddress = body.address;
        const customeremail = body.email;
        const paymentmethod = body.paymentmethod;
        const deliverymethod = body.deliverymethod;
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
        let emailitems = "";
        for (let i = 0; i < cartitems.length; i = i + 1) {
            let itemprice = cartitems[i].product.price;
            let customtext = "";
            if (cartitems[i].isCustom === true) {
                itemprice = itemprice + 100;
                customtext = " (custom note: " + cartitems[i].customNote + ")";
            }
            let itemquantity = cartitems[i].quantity;
            let itemname = cartitems[i].product.name;
            totalamount = totalamount + (itemprice * itemquantity);
            emailitems = emailitems + "- " + itemquantity + "x " + itemname + customtext + " (৳" + itemprice + " each)\n";
        }

        let shippingcost = 80;
        if (deliverymethod.includes("express")) {
            shippingcost = 240;
        }
        totalamount = totalamount + shippingcost;
        const neworder = await prisma.order.create({
            data: {
                userId: userid,
                totalAmount: totalamount,
                shippingAddress: shippingaddress,
                status: "PENDING"
            }
        });

        for (let i = 0; i < cartitems.length; i = i + 1) {
            let finalprice = cartitems[i].product.price;
            if (cartitems[i].isCustom === true) {
                finalprice = finalprice + 100;
            }
            await prisma.orderItem.create({
                data: {
                    orderId: neworder.id,
                    productId: cartitems[i].product.id,
                    quantity: cartitems[i].quantity,
                    price: finalprice
                }
            });
        }

        await prisma.cartItem.deleteMany({
            where: {
                userid: userid
            }
        });
        const emailtext = "stella pet care - order confirmation\n\n" +
            "thank you for your order! your order id is: " + neworder.id + "\n\n" +
            "--- order summary ---\n\n" +
            "items ordered:\n" + emailitems + "\n" +
            "shipping cost: ৳" + shippingcost + "\n" +
            "total amount: ৳" + totalamount + "\n\n" +
            "--- delivery & payment ---\n\n" +
            "delivery method: " + deliverymethod + "\n" +
            "payment method: " + paymentmethod + "\n\n" +
            "shipping address:\n" + shippingaddress + "\n\n" +
            "we will prepare your order soon.";

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: customeremail,
            subject: "your stella receipt - order " + neworder.id,
            text: emailtext
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "failed" });
    }
}