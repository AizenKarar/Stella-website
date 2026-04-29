"use client";
import { useState, useEffect } from "react";
export default function appointmentpage() {
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
        setmessage("booking...");
        const requestbody = {
            doctorId: doctorid,
            date: date,
            time: time,
            reason: "standard checkup"
        };
        const stringifiedbody = JSON.stringify(requestbody);
        const response = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: stringifiedbody,
        });
        if (response.ok === true) {
            setmessage("success! appointment booked.");
            setdivision("");
            setcity("");
            sethospitalid("");
            setdoctorid("");
            setdate("");
            settime("");
        } else {
            setmessage("oops! something went wrong.");
        }
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">loading clinics...</p>
            </div>
        );
    }

    let messagebox = null;
    if (message !== "") {
        let messagestyle = "bg-[#FAFAFA] text-[#1B3B4D] border border-[#1B3B4D]";
        if (message === "oops! something went wrong.") {
            messagestyle = "bg-white text-red-600 border border-red-600";
        }
        messagebox = (
            <div className={"mt-8 p-6 text-center font-bold uppercase tracking-[0.1em] text-xs " + messagestyle}>
                {message}
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 pb-20 relative">

            <div className="max-w-[1400px] mx-auto">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3B4D] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Book<br />Appointment.
                        </h1>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        stella pet care // clinic
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="w-full aspect-square border border-gray-200 bg-[#FAFAFA] flex flex-col items-center justify-center p-10 relative">
                            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">expert care</span>
                            <div className="text-center">
                                <span className="text-6xl mb-6 block text-[#1B3B4D]">🩺</span>
                                <h3 className="text-lg font-black uppercase tracking-widest text-[#1B3B4D] mb-4">Stella Clinics</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                                    Schedule a visit with our top-tier veterinary professionals. We ensure the highest standard of care and comfort for your companions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <form onSubmit={submitappointment} className="flex flex-col gap-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">01. division</label>
                                    <select
                                        className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors appearance-none font-medium text-sm"
                                        value={division}
                                        onChange={(e) => {
                                            setdivision(e.target.value);
                                            setcity("");
                                            sethospitalid("");
                                            setdoctorid("");
                                        }}
                                        required
                                    >
                                        <option value="">-- select division --</option>
                                        {availabledivisions.map((div) => (
                                            <option key={div} value={div}>{div}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">02. city</label>
                                    <select
                                        className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors appearance-none font-medium text-sm disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        value={city}
                                        onChange={(e) => {
                                            setcity(e.target.value);
                                            sethospitalid("");
                                            setdoctorid("");
                                        }}
                                        required
                                        disabled={division === ""}
                                    >
                                        <option value="">-- select city --</option>
                                        {availablecities.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">03. hospital</label>
                                <select
                                    className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors appearance-none font-medium text-sm disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={hospitalid}
                                    onChange={(e) => {
                                        sethospitalid(e.target.value);
                                        setdoctorid("");
                                    }}
                                    required
                                    disabled={city === ""}
                                >
                                    <option value="">-- select hospital --</option>
                                    {availablehospitals.map((h) => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">04. doctor</label>
                                <select
                                    className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors appearance-none font-medium text-sm disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={doctorid}
                                    onChange={(e) => setdoctorid(e.target.value)}
                                    required
                                    disabled={hospitalid === ""}
                                >
                                    <option value="">-- select doctor --</option>
                                    {availabledoctors.map((doc) => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8 mt-2">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">05. date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm"
                                        value={date}
                                        onChange={(e) => setdate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">06. time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm"
                                        value={time}
                                        onChange={(e) => settime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#1B3B4D] text-white py-6 mt-8 font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(104,173,182,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 border border-[#1B3B4D] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0px_0px_rgba(104,173,182,1)]"
                            >
                                finalize booking
                            </button>
                        </form>
                        {messagebox}
                    </div>

                </div>
            </div>
        </div>
    );
}