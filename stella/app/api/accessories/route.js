import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const animalfilter = url.searchParams.get("animal");

        let querywhere = {
            category: "ACCESSORY"
        };

        if (animalfilter !== null && animalfilter !== "ALL") {
            querywhere.animalType = animalfilter;
        }

        const products = await prisma.product.findMany({
            where: querywhere
        });

        return Response.json(products);
    } catch (error) {
        return Response.json([]);
    }
}