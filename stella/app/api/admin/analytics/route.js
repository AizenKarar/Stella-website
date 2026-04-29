import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } }
        });
        let totalrevenue = 0;
        let totalitemsold = 0;
        let producttracker = {};
        for (const order of orders) {
            totalrevenue = totalrevenue + order.totalAmount;
            for (const item of order.items) {
                totalitemsold = totalitemsold + item.quantity;
                let productid = item.product.id;
                let productname = item.product.name;
                if (producttracker[productid] === undefined) {
                    producttracker[productid] = { name: productname, count: item.quantity };
                } else {
                    producttracker[productid].count = producttracker[productid].count + item.quantity;
                }
            }
        }
        let sortedproducts = [];
        for (const key in producttracker) {
            sortedproducts.push(producttracker[key]);
        }
        sortedproducts.sort((a, b) => b.count - a.count);
        return NextResponse.json({
            totalorders: orders.length,
            totalrevenue: totalrevenue,
            totalproductssold: totalitemsold,
            topsold: sortedproducts.slice(0, 5)
        });
    } catch (error) {
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}