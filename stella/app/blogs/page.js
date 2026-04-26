"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function blogspage() {
    const [blogs, setblogs] = useState([]);
    const [loading, setloading] = useState(true);
    const [searchquery, setsearchquery] = useState("");

    useEffect(() => {
        async function loadblogs() {
            try {
                const response = await fetch("/api/blogs");
                const result = await response.json();

                if (result.data !== undefined) {
                    setblogs(result.data);
                } else if (Array.isArray(result) === true) {
                    setblogs(result);
                } else {
                    setblogs([]);
                }

                setloading(false);
            } catch (error) {
                console.log(error);
                setblogs([]);
                setloading(false);
            }
        }
        loadblogs();
    }, []);

    let displayblogs = [];

    if (blogs !== undefined && blogs !== null) {
        if (searchquery === "") {
            displayblogs = blogs.slice(0, 4);
        } else {
            displayblogs = blogs.filter((b) =>
                b.title.toLowerCase().includes(searchquery.toLowerCase())
            );
        }
    }

    if (loading) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">loading journal...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 pb-20 relative">
            <div className="max-w-[1000px] mx-auto">

                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3B4D] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Stella<br />Journal.
                        </h1>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        pet care // articles
                    </div>
                </header>

                <div className="mb-12">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-3 text-gray-500">search archive</label>
                    <input
                        type="text"
                        placeholder="keyword or title..."
                        value={searchquery}
                        onChange={(e) => setsearchquery(e.target.value)}
                        className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-5 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm"
                    />
                </div>

                <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
                    <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                        {searchquery === "" ? "latest entries" : "search results"}
                    </h2>
                    <span className="text-[10px] font-bold text-[#1B3B4D] uppercase tracking-widest">{displayblogs.length} articles</span>
                </div>

                <div className="flex flex-col gap-6">
                    {displayblogs.length === 0 ? (
                        <div className="border border-gray-200 p-12 text-center">
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.1em]">no articles found matching your query.</p>
                        </div>
                    ) : null}

                    {displayblogs.map((blog) => (
                        <Link key={blog.id} href={"/blogs/" + blog.id}>
                            <div className="bg-white p-8 border border-gray-200 hover:border-[#1B3B4D] hover:bg-[#FAFAFA] transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-grow">
                                    <p className="text-[10px] text-[#68ADB6] uppercase tracking-[0.2em] mb-3 font-black">
                                        by {blog.author}
                                    </p>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#1B3B4D] mb-3 group-hover:text-black transition-colors">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 max-w-2xl">
                                        {blog.content}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 border border-[#1B3B4D] text-[#1B3B4D] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:bg-[#1B3B4D] group-hover:text-white transition-colors">
                                    read full
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}