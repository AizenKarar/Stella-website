"use client";

import { useState } from "react";

export default function SimplePostExample() {
    // 1. Create state to hold what the user types into the input boxes
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    // 2. Create the function that fires when the button is clicked
    async function handleAddBlog(e) {
        e.preventDefault(); // This stops the page from refreshing when you submit

        try {
            // Bundle up the state variables into one object
            const newBlogData = {
                title: title,
                author: author,
                content: content
            };

            // Send it to your POST API route
            const response = await fetch("/api/blogs", {
                method: "POST", // You MUST tell fetch it's a POST request
                headers: {
                    "Content-Type": "application/json" // Tells the backend to expect JSON data
                },
                body: JSON.stringify(newBlogData) // Turn the object into a string for traveling over the internet
            });

            const result = await response.json();

            // If successful, clear out the input boxes so they are empty again
            if (result.data) {
                setTitle("");
                setAuthor("");
                setContent("");
                alert("Blog successfully created!");
            }

        } catch (error) {
            console.log("Error creating blog", error);
        }
    }

    // 3. Display the input form
    return (
        <div className="p-10 font-sans text-[#1B3B4D] max-w-lg">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-6">
                Create a New Entry
            </h1>

            <form onSubmit={handleAddBlog} className="flex flex-col gap-4">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 p-3 text-sm focus:border-[#1B3B4D] focus:outline-none"
                    required
                />

                {/* Author Input */}
                <input
                    type="text"
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="border border-gray-300 p-3 text-sm focus:border-[#1B3B4D] focus:outline-none"
                    required
                />

                {/* Content Input */}
                <textarea
                    placeholder="Write your content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border border-gray-300 p-3 text-sm focus:border-[#1B3B4D] focus:outline-none h-32"
                    required
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-[#1B3B4D] text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                    Publish Blog
                </button>
            </form>
        </div>
    );
}