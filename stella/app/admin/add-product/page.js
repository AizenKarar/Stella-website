"use client";
import { useState } from "react";
export default function adminpage() {
    const [name, setname] = useState("");
    const [description, setdescription] = useState("");
    const [price, setprice] = useState("");
    const [stock, setstock] = useState("");
    const [imageurl, setimageurl] = useState("");
    const [category, setcategory] = useState("FOOD");
    const [animaltype, setanimaltype] = useState("BOTH");
    const [status, setstatus] = useState("");
    const [isloading, setisloading] = useState(false);
    async function handlesubmit(event) {
        event.preventDefault();
        setisloading(true);
        setstatus("adding...");
        try {
            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    price: price,
                    stock: stock,
                    imageurl: imageurl,
                    category: category,
                    animaltype: animaltype
                })
            });
            if (response.ok === true) {
                setstatus("success");
                setname("");
                setdescription("");
                setprice("");
                setstock("");
                setimageurl("");
            } else {
                setstatus("failed");
            }
        } catch (error) {
            setstatus("error");
        } finally {
            setisloading(false);
            setTimeout(() => setstatus(""), 4000);
        }
    }
    return (
        <div className="bg-white min-h-screen font-sans text-[#1b3b4d] p-6 md:p-12 pb-32 relative">
            <div className="max-w-[800px] mx-auto">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1b3b4d] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">admin<br />upload.</h1>
                    </div>
                </header>
                <div className="bg-[#fafafa] border-t-4 border-[#1b3b4d] p-8 md:p-10 shadow-lg bg-white">
                    <form onSubmit={handlesubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">product name</label>
                                <input type="text" required value={name} onChange={(event) => setname(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">price</label>
                                <input type="number" required min="0" step="0.01" value={price} onChange={(event) => setprice(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">category</label>
                                <select value={category} onChange={(event) => setcategory(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm appearance-none">
                                    <option value="FOOD">food</option>
                                    <option value="TOY">toy</option>
                                    <option value="ACCESSORY">accessory</option>
                                    <option value="LITTER">litter</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">animal type</label>
                                <select value={animaltype} onChange={(event) => setanimaltype(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm appearance-none">
                                    <option value="BOTH">both</option>
                                    <option value="DOG">dog</option>
                                    <option value="CAT">cat</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">stock</label>
                                <input type="number" required min="0" value={stock} onChange={(event) => setstock(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">image url</label>
                                <input type="url" value={imageurl} onChange={(event) => setimageurl(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">description</label>
                            <textarea required value={description} onChange={(event) => setdescription(event.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1b3b4d] p-4 h-32 resize-none focus:outline-none focus:border-[#1b3b4d] transition-colors font-medium text-sm"></textarea>
                        </div>
                        <div className="mt-4 border-t border-gray-200 pt-6">
                            <button type="submit" disabled={isloading} className="w-full bg-[#1b3b4d] text-white py-6 font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-colors shadow-[8px_8px_0px_0px_rgba(104,173,182,1)] border border-[#1b3b4d]">publish</button>
                        </div>
                    </form>
                </div>
            </div>
            {status !== "" ? (<div className="fixed bottom-10 right-10 px-8 py-5 border border-black font-bold uppercase tracking-[0.2em] text-[10px] z-50 bg-[#1b3b4d] text-white">{status}</div>) : null}
        </div>
    );
}