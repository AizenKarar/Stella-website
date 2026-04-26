"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function customorderpage() {
    const [products, setproducts] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [toastmessage, settoastmessage] = useState("");
    const [selectedcustomid, setselectedcustomid] = useState("");
    const [customdescription, setcustomdescription] = useState("");
    const [iscustomloading, setiscustomloading] = useState(false);
    const [searchterm, setsearchterm] = useState("");

    useEffect(() => {
        async function fetchproducts() {
            setisloading(true);
            try {
                const response = await fetch("/api/accessories", { cache: "no-store" });
                if (response.ok === true) {
                    const data = await response.json();
                    if (Array.isArray(data) === true) {
                        setproducts(data);
                    } else {
                        setproducts([]);
                    }
                }
            } catch (error) {
                setproducts([]);
            } finally {
                setisloading(false);
            }
        }
        fetchproducts();
    }, []);

    async function submitcustomorder() {
        if (selectedcustomid === "") {
            settoastmessage("please select a base item first");
            setTimeout(() => settoastmessage(""), 3000);
            return;
        }
        if (customdescription === "") {
            settoastmessage("please write a description");
            setTimeout(() => settoastmessage(""), 3000);
            return;
        }
        setiscustomloading(true);
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({
                    productid: selectedcustomid,
                    iscustom: true,
                    customnote: customdescription
                })
            });

            if (response.ok === true) {
                settoastmessage("custom item added to your cart!");
                setselectedcustomid("");
                setcustomdescription("");
                setsearchterm("");
            } else {
                settoastmessage("failed to add to cart.");
            }
        } catch (error) {
            settoastmessage("network error occurred.");
        } finally {
            setiscustomloading(false);
            setTimeout(() => settoastmessage(""), 3000);
        }
    }

    let searchresults = [];
    let selectedproduct = null;

    if (Array.isArray(products) === true) {
        for (let i = 0; i < products.length; i = i + 1) {
            if (products[i].id === selectedcustomid) {
                selectedproduct = products[i];
            }
            if (searchterm !== "") {
                if (products[i].name.toLowerCase().includes(searchterm.toLowerCase())) {
                    searchresults.push(products[i]);
                }
            }
        }
    }

    if (selectedproduct !== null && searchterm === selectedproduct.name) {
        searchresults = [];
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">loading studio...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 relative">

            <div className="max-w-[1400px] mx-auto">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3B4D] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Custom<br />Order.
                        </h1>
                    </div>
                    <Link href="/products/accessories" className="text-xs uppercase tracking-[0.2em] font-bold hover:text-gray-500 transition-colors flex items-center gap-2">
                        <span>←</span> return to collection
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

                    <div className="flex flex-col gap-8">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-[0.1em] block mb-4">01. select base canvas</label>
                            <div className="relative w-full z-40">
                                <input
                                    type="text"
                                    placeholder="search accessories..."
                                    value={searchterm}
                                    onChange={(e) => {
                                        setsearchterm(e.target.value);
                                        setselectedcustomid("");
                                    }}
                                    className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm"
                                />
                                {searchresults.length > 0 ? (
                                    <div className="absolute top-full mt-[-1px] w-full bg-white border border-[#1B3B4D] max-h-56 overflow-y-auto z-50">
                                        {searchresults.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    setselectedcustomid(item.id);
                                                    setsearchterm(item.name);
                                                }}
                                                className="p-4 hover:bg-[#1B3B4D] hover:text-white cursor-pointer border-b border-gray-100 text-sm font-medium transition-colors flex justify-between items-center group"
                                            >
                                                <span>{item.name}</span>
                                                <span className="font-bold group-hover:text-white text-gray-500">৳{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="w-full aspect-square border border-gray-200 bg-[#FAFAFA] flex items-center justify-center p-10 relative">
                            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">preview</span>
                            {selectedproduct !== null && selectedproduct.imageUrl !== null && selectedproduct.imageUrl !== "" ? (
                                <img src={selectedproduct.imageUrl} alt="preview" className="max-h-full object-contain mix-blend-multiply" />
                            ) : (
                                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center">
                                    <span className="text-gray-300 text-xl font-light">+</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-[0.1em] block mb-4">02. artisan instructions</label>
                            <textarea
                                value={customdescription}
                                onChange={(e) => setcustomdescription(e.target.value)}
                                placeholder="describe your exact requirements. materials, colors, engravings..."
                                className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-6 rounded-none focus:outline-none focus:border-[#1B3B4D] transition-colors resize-none h-64 text-sm leading-relaxed"
                            ></textarea>
                        </div>

                        <div className="mt-12 bg-[#FAFAFA] border border-gray-200 p-8">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-gray-200 pb-4">order summary</h3>

                            <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                <span>base item price</span>
                                <span className="text-[#1B3B4D]">৳{selectedproduct !== null ? selectedproduct.price.toFixed(2) : "0.00"}</span>
                            </div>
                            <div className="flex justify-between items-center mb-8 text-xs font-bold uppercase tracking-wider text-gray-500">
                                <span>bespoke crafting fee</span>
                                <span className="text-[#1B3B4D]">৳100.00</span>
                            </div>

                            <div className="flex justify-between items-end border-t border-[#1B3B4D] pt-6">
                                <span className="font-bold uppercase tracking-[0.1em] text-sm">total</span>
                                <span className="text-2xl font-black">৳{selectedproduct !== null ? (selectedproduct.price + 100).toFixed(2) : "0.00"}</span>
                            </div>
                        </div>

                        <button onClick={submitcustomorder} disabled={iscustomloading} className="w-full bg-[#1B3B4D] text-white py-6 mt-8 font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-colors shadow-[8px_8px_0px_0px_rgba(104,173,182,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 border border-[#1B3B4D] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0px_0px_rgba(104,173,182,1)]">
                            {iscustomloading === true ? "processing..." : "finalize & add to cart"}
                        </button>
                    </div>

                </div>
            </div>

            {toastmessage !== "" ? (
                <div className="fixed bottom-10 right-10 bg-[#1B3B4D] text-white px-8 py-5 border border-black font-bold uppercase tracking-[0.2em] text-[10px] z-50">
                    {toastmessage}
                </div>
            ) : null}
        </div>
    );
}