import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const authdata = await auth();
        const clerkid = authdata.userId;
        if (clerkid === null) {
            return NextResponse.json({ message: "unauthorized" });
        }
        const dbuser = await prisma.user.findUnique({
            where: { clerkId: clerkid }
        });
        const currentuser = dbuser.id;
        const body = await request.json();
        const mydoctorid = body.doctorId;
        const mydate = body.date;
        const mytime = body.time;
        const combineddatestring = mydate + "T" + mytime + ":00Z";
        const finaldateobject = new Date(combineddatestring);
        const savedappointment = await prisma.appointment.create({
            data: {
                userId: currentuser,
                doctorId: mydoctorid,
                date: finaldateobject
            }
        });
        return NextResponse.json({
            message: "success",
            data: savedappointment
        });
    } catch (error) {
        return NextResponse.json({ message: "failed" });
    }
}