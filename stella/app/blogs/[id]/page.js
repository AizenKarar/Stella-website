"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SingleBlogPage({ params }) {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSingleBlog() {
            try {
                const resolvedParams = await params;
                const blogId = resolvedParams.id;

                const response = await fetch("/api/blogs/" + blogId);
                const result = await response.json();

                if (result.data !== undefined) {
                    setBlog(result.data);
                } else if (result.error !== undefined) {
                    setBlog(null);
                } else {
                    setBlog(result);
                }

                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        loadSingleBlog();
    }, [params]);

    if (loading) {
        return <div className="p-10 text-center text-[#F2C4CE] font-bold uppercase tracking-widest bg-[#2C2B30] min-h-screen">Loading Article...</div>;
    }

    if (blog === null) {
        return <div className="p-10 text-center text-red-400 font-bold uppercase tracking-widest bg-[#2C2B30] min-h-screen">Blog Not Found</div>;
    }

    return (
        <div className="p-10 font-sans bg-[#2C2B30] min-h-screen flex flex-col items-center">
            <div className="w-full max-w-4xl bg-[#35343A] p-10 rounded-xl border border-[#45444A] shadow-2xl shadow-black/50">

                <Link href="/blogs" className="text-[#F2C4CE] font-bold uppercase tracking-widest mb-8 inline-block hover:opacity-80 transition-opacity">
                    &larr; Back to Blogs
                </Link>

                <h1 className="text-4xl font-bold mb-4 text-white">{blog.title}</h1>
                <p className="text-sm text-[#F2C4CE] uppercase tracking-wide mb-10 pb-6 border-b border-[#45444A]">Written By {blog.author}</p>

                <div className="text-zinc-300 leading-loose text-lg whitespace-pre-wrap">
                    {blog.content}
                </div>

            </div>
        </div>
    );
}