"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function singleblogpage({ params }) {
    const [blog, setblog] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        async function loadsingleblog() {
            try {
                const resolvedparams = await params;
                const blogid = resolvedparams.id;

                const response = await fetch("/api/blogs/" + blogid);
                const result = await response.json();

                if (result.data !== undefined) {
                    setblog(result.data);
                } else if (result.error !== undefined) {
                    setblog(null);
                } else {
                    setblog(result);
                }

                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
            }
        }
        loadsingleblog();
    }, [params]);

    if (loading) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">loading entry...</p>
            </div>
        );
    }

    if (blog === null) {
        return (
            <div className="p-10 flex flex-col justify-center items-center min-h-screen bg-white gap-6">
                <p className="text-red-600 font-bold text-sm uppercase tracking-[0.2em]">document not found</p>
                <Link href="/blogs" className="border border-[#1B3B4D] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1B3B4D] hover:text-white transition-colors">
                    return to journal
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 pb-32 relative flex flex-col items-center">

            <div className="w-full max-w-[800px]">

                <Link href="/blogs" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-[#1B3B4D] mb-16 transition-colors">
                    <span className="text-lg leading-none mb-0.5">←</span> return to journal
                </Link>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-8 text-[#1B3B4D]">
                    {blog.title}
                </h1>

                <div className="flex justify-between items-end border-b-2 border-[#1B3B4D] pb-6 mb-12">
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                        author // <span className="text-[#1B3B4D]">{blog.author}</span>
                    </p>
                    <p className="text-[10px] text-[#68ADB6] uppercase tracking-[0.2em] font-black">
                        stella insights
                    </p>
                </div>

                <div className="text-sm md:text-base text-gray-700 leading-loose whitespace-pre-wrap font-medium">
                    {blog.content}
                </div>

                <div className="mt-20 pt-10 border-t border-gray-200 flex justify-center">
                    <div className="w-8 h-8 border border-[#1B3B4D] rotate-45"></div>
                </div>

            </div>
        </div>
    );
}