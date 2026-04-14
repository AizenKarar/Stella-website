import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const body = await request.json();
        const myuserid = "4976ff87-d687-459d-84f4-d1965b343cf9";
        const mydoctorid = body.doctorId;
        const mydate = body.date;
        const mytime = body.time;
        const combineddatestring = mydate + "T" + mytime + ":00Z";
        const finaldateobject = new Date(combineddatestring);
        const savedappointment = await prisma.appointment.create({
            data: {
                userId: myuserid,
                doctorId: mydoctorid,
                date: finaldateobject,
            }
        });
        return NextResponse.json({
            message: "Yay! Appointment Booked Successfully",
            data: savedappointment
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Sorry, the server failed to book the appointment." });
    }
}