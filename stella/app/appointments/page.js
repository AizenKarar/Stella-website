"use client";
import { useState, useEffect } from "react";

export default function AppointmentPage() {
    const [hospitalsdata, sethospitalsdata] = useState([]);
    const [division, setdivision] = useState("");
    const [city, setcity] = useState("");
    const [hospitalid, sethospitalid] = useState("");
    const [doctorid, setdoctorid] = useState("");
    const [date, setdate] = useState("");
    const [time, settime] = useState("");
    const [message, setmessage] = useState("");
    const [isloading, setisloading] = useState(true);

    useEffect(() => {
        async function fetchhospitals() {
            try {
                const response = await fetch("/api/hospitals", { cache: "no-store" });
                const data = await response.json();
                if (Array.isArray(data) === true) {
                    sethospitalsdata(data);
                } else if (data.data !== undefined) {
                    sethospitalsdata(data.data);
                } else {
                    sethospitalsdata([]);
                }
                setisloading(false);
            } catch (error) {
                console.log(error);
                sethospitalsdata([]);
                setisloading(false);
            }
        }
        fetchhospitals();
    }, []);
    let safehospitals = [];
    if (Array.isArray(hospitalsdata) === true) {
        safehospitals = hospitalsdata;
    }
    let availabledivisions = [];
    for (let i = 0; i < safehospitals.length; i = i + 1) {
        let currentdivision = safehospitals[i].division;
        let isduplicate = false;
        for (let j = 0; j < availabledivisions.length; j = j + 1) {
            if (availabledivisions[j] === currentdivision) {
                isduplicate = true;
            }
        }
        if (isduplicate === false) {
            availabledivisions.push(currentdivision);
        }
    }
    let availablecities = [];
    for (let i = 0; i < safehospitals.length; i = i + 1) {
        let currenthospital = safehospitals[i];
        if (currenthospital.division === division) {
            let currentcity = currenthospital.city;
            let isduplicate = false;
            for (let j = 0; j < availablecities.length; j = j + 1) {
                if (availablecities[j] === currentcity) {
                    isduplicate = true;
                }
            }
            if (isduplicate === false) {
                availablecities.push(currentcity);
            }
        }
    }
    let availablehospitals = [];
    for (let i = 0; i < safehospitals.length; i = i + 1) {
        let currenthospital = safehospitals[i];
        if (currenthospital.division === division) {
            if (currenthospital.city === city) {
                availablehospitals.push(currenthospital);
            }
        }
    }
    let availabledoctors = [];
    for (let i = 0; i < safehospitals.length; i = i + 1) {
        let currenthospital = safehospitals[i];
        if (currenthospital.id === hospitalid) {
            availabledoctors = currenthospital.doctors;
        }
    }
    async function submitappointment(event) {
        event.preventDefault();
        setmessage("Booking...");
        const requestbody = {
            doctorId: doctorid,
            date: date,
            time: time,
            reason: "Standard checkup"
        };
        const stringifiedbody = JSON.stringify(requestbody);
        const response = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: stringifiedbody,
        });
        if (response.ok === true) {
            setmessage("Success! Appointment Booked.");
            setdivision("");
            setcity("");
            sethospitalid("");
            setdoctorid("");
            setdate("");
            settime("");
        } else {
            setmessage("Oops! Something went wrong.");
        }
    }
    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center h-screen bg-[#2C2B30]">
                <p className="text-[#F2C4CE] font-bold text-xl uppercase tracking-widest animate-pulse">Loading available clinics...</p>
            </div>
        );
    }
    let messagebox = null;
    if (message !== "") {
        let messagestyle = "bg-[#F2C4CE]/20 text-[#F2C4CE] border border-[#F2C4CE]/50";
        if (message === "Oops! Something went wrong.") {
            messagestyle = "bg-red-900/50 text-red-400 border border-red-800";
        }
        messagebox = (
            <div className={"mt-6 p-4 rounded text-center font-bold " + messagestyle}>
                {message}
            </div>
        );
    }
    return (
        <div className="p-10 flex flex-col items-center font-sans bg-[#2C2B30] min-h-screen">
            <div className="bg-[#35343A] p-8 rounded-xl shadow-2xl shadow-[#F2C4CE]/10 w-full max-w-lg border border-[#45444A]">
                <h1 className="text-3xl font-bold mb-8 text-center text-[#F2C4CE] tracking-wider uppercase">Stella Appointments</h1>
                <form onSubmit={submitappointment} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Division</label>
                        <select
                            className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                            value={division}
                            onChange={(e) => {
                                setdivision(e.target.value);
                                setcity("");
                                sethospitalid("");
                                setdoctorid("");
                            }}
                            required
                        >
                            <option value="">-- Select Division --</option>
                            {availabledivisions.map((div) => (
                                <option key={div} value={div}>{div}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">City</label>
                        <select
                            className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                            value={city}
                            onChange={(e) => {
                                setcity(e.target.value);
                                sethospitalid("");
                                setdoctorid("");
                            }}
                            required
                            disabled={division === ""}
                        >
                            <option value="">-- Select City --</option>
                            {availablecities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Hospital</label>
                        <select
                            className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                            value={hospitalid}
                            onChange={(e) => {
                                sethospitalid(e.target.value);
                                setdoctorid("");
                            }}
                            required
                            disabled={city === ""}
                        >
                            <option value="">-- Select Hospital --</option>
                            {availablehospitals.map((h) => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Doctor</label>
                        <select
                            className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                            value={doctorid}
                            onChange={(e) => setdoctorid(e.target.value)}
                            required
                            disabled={hospitalid === ""}
                        >
                            <option value="">-- Select Doctor --</option>
                            {availabledoctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2">
                            <label className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                                value={date}
                                onChange={(e) => setdate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Time</label>
                            <input
                                type="time"
                                className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                                value={time}
                                onChange={(e) => settime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-[#F2C4CE] text-[#2C2B30] font-bold uppercase tracking-widest p-4 rounded mt-4 hover:opacity-80 transition-opacity disabled:opacity-50">
                        Book Appointment
                    </button>
                </form>
                {messagebox}
            </div>
        </div>
    );
}