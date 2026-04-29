"use client";
import { useState, useEffect } from "react";
export default function analytics() {
    const [data, setdata] = useState(null);
    const [isloading, setisloading] = useState(true);
    useEffect(() => {
        async function fetchdata() {
            try {
                const response = await fetch("/api/admin/analytics", { cache: "no-store" });
                if (response.ok === true) {
                    const result = await response.json();
                    setdata(result);
                }
            } catch (error) {
                setdata(null);
            } finally {
                setisloading(false);
            }
        }
        fetchdata();
    }, []);
    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1b3b4d] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">loading data...</p>
            </div>
        );
    }
    return (
        <div className="bg-white min-h-screen font-sans text-[#1b3b4d] p-6 md:p-12 pb-32 relative">
            <div className="max-w-[1000px] mx-auto">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1b3b4d] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">admin<br />analytics.</h1>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="border border-[#1b3b4d] p-8 bg-[#fafafa]">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">total orders</h2>
                        <p className="text-4xl font-black text-[#1b3b4d]">{data !== null ? data.totalorders : 0}</p>
                    </div>
                    <div className="border border-[#1b3b4d] p-8 bg-[#fafafa]">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">total revenue</h2>
                        <p className="text-4xl font-black text-[#68adb6]">৳{data !== null ? data.totalrevenue.toFixed(2) : "0.00"}</p>
                    </div>
                    <div className="border border-[#1b3b4d] p-8 bg-[#fafafa]">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">items sold</h2>
                        <p className="text-4xl font-black text-[#1b3b4d]">{data !== null ? data.totalproductssold : 0}</p>
                    </div>
                </div>
                <div className="border border-[#1b3b4d] p-8 bg-[#fafafa]">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 border-b border-gray-200 pb-4">top selling products</h2>
                    <div className="flex flex-col gap-4">
                        {data !== null && data.topsold !== undefined && data.topsold.length > 0 ? (
                            data.topsold.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4">
                                    <span className="font-bold text-sm uppercase tracking-wider">{item.name}</span>
                                    <span className="font-black text-[#1b3b4d]">{item.count} sold</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">no sales data yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}