"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadBlogs() {
            try {
                const response = await fetch("/api/blogs");
                const result = await response.json();

                if (result.data !== undefined) {
                    setBlogs(result.data);
                } else if (Array.isArray(result) === true) {
                    setBlogs(result);
                } else {
                    setBlogs([]);
                }

                setLoading(false);
            } catch (error) {
                console.log(error);
                setBlogs([]);
                setLoading(false);
            }
        }
        loadBlogs();
    }, []);

    let displayBlogs = [];

    if (blogs !== undefined && blogs !== null) {
        if (searchQuery === "") {
            displayBlogs = blogs.slice(0, 4);
        } else {
            displayBlogs = blogs.filter((b) =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    }

    if (loading) {
        return <div className="p-10 text-center text-[#F2C4CE] font-bold uppercase tracking-widest bg-[#2C2B30] min-h-screen">Loading Articles...</div>;
    }

    return (
        <div className="p-10 font-sans bg-[#2C2B30] min-h-screen flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-[#F2C4CE] uppercase tracking-widest">Stella Pet Care Blog</h1>

                <input
                    type="text"
                    placeholder="Search blogs by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#232227] border border-[#45444A] text-white p-4 rounded-xl focus:outline-none focus:border-[#F2C4CE] transition-colors mb-10 text-lg shadow-xl shadow-black/50"
                />

                {searchQuery === "" && displayBlogs.length > 0 && (
                    <h2 className="text-xl text-zinc-400 mb-6 uppercase tracking-widest font-bold">Most Recent Articles</h2>
                )}

                {searchQuery !== "" && (
                    <h2 className="text-xl text-zinc-400 mb-6 uppercase tracking-widest font-bold">Search Results</h2>
                )}

                <div className="flex flex-col gap-6">
                    {displayBlogs.length === 0 ? (
                        <p className="text-zinc-500 text-center text-xl mt-10">No blogs found.</p>
                    ) : null}

                    {displayBlogs.map((blog) => (
                        <Link key={blog.id} href={"/blogs/" + blog.id}>
                            <div className="bg-[#35343A] p-8 rounded-xl border border-[#45444A] hover:border-[#F2C4CE] transition-all cursor-pointer shadow-lg shadow-black/30">
                                <h2 className="text-2xl font-bold mb-2 text-white hover:text-[#F2C4CE]">{blog.title}</h2>
                                <p className="text-sm text-[#F2C4CE] uppercase tracking-wide mb-4">By {blog.author}</p>
                                <p className="text-zinc-400 leading-relaxed line-clamp-3">
                                    {blog.content}
                                </p>
                                <p className="text-[#F2C4CE] mt-4 font-bold text-sm uppercase tracking-widest">Read Full Article &rarr;</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}