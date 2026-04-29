"use client";
import { useState, useEffect } from "react";

export default function toyspage() {
    const [products, setproducts] = useState([]);
    const [animalfilter, setanimalfilter] = useState("ALL");
    const [isloading, setisloading] = useState(true);
    const [toastmessage, settoastmessage] = useState("");

    useEffect(() => {
        async function fetchproducts() {
            setisloading(true);
            try {
                let myurl = "/api/products?category=TOY";
                if (animalfilter !== "ALL") {
                    myurl = myurl + "&animal=" + animalfilter;
                }
                const response = await fetch(myurl, { cache: "no-store" });
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
    }, [animalfilter]);

    async function addtocart(product) {
        await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({ productid: product.id })
        });
        settoastmessage(product.name + " added to cart!");
        setTimeout(() => {
            settoastmessage("");
        }, 3000);
    }

    let displayproducts = [];
    if (Array.isArray(products) === true) {
        for (let i = 0; i < products.length; i = i + 1) {
            displayproducts.push(products[i]);
        }
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-xl uppercase tracking-widest animate-pulse">loading products...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 pb-20 relative">

            <div className="max-w-[1400px] mx-auto">

                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3B4D] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Playful<br />Toys.
                        </h1>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        stella pet care // toy collection
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-10 lg:gap-20">

                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="mb-10">
                            <h3 className="font-bold text-sm mb-4 border-b border-gray-200 pb-3 uppercase tracking-widest text-[#1B3B4D]">filter by animal</h3>
                            <div className="flex flex-col gap-4 mt-4">
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-500 hover:text-[#1B3B4D] transition-colors">
                                    <input type="radio" name="animal" value="ALL" checked={animalfilter === "ALL"} onChange={(e) => setanimalfilter(e.target.value)} className="w-4 h-4 accent-[#1B3B4D]" />
                                    All Pets
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-500 hover:text-[#1B3B4D] transition-colors">
                                    <input type="radio" name="animal" value="CAT" checked={animalfilter === "CAT"} onChange={(e) => setanimalfilter(e.target.value)} className="w-4 h-4 accent-[#1B3B4D]" />
                                    Cats Only
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-500 hover:text-[#1B3B4D] transition-colors">
                                    <input type="radio" name="animal" value="DOG" checked={animalfilter === "DOG"} onChange={(e) => setanimalfilter(e.target.value)} className="w-4 h-4 accent-[#1B3B4D]" />
                                    Dogs Only
                                </label>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="font-bold text-sm mb-4 border-b border-gray-200 pb-3 uppercase tracking-widest text-[#1B3B4D]">stock status</h3>
                            <div className="flex flex-col gap-4 mt-4">
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-500">
                                    <input type="checkbox" checked readOnly className="w-4 h-4 accent-[#1B3B4D]" />
                                    In stock
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 text-sm text-gray-500 gap-4 border-b border-gray-100 pb-4">
                            <div className="tracking-wide">
                                Home <span className="mx-2">/</span> Products <span className="mx-2">/</span> <span className="text-[#1B3B4D] font-bold">Toys</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span>Show : <span className="text-[#1B3B4D] font-bold">All</span></span>
                                <div className="flex gap-2">
                                    <span className="text-[#1B3B4D] text-lg cursor-pointer">⊞</span>
                                    <span className="text-gray-300 text-lg cursor-pointer">⊟</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayproducts.length === 0 ? (
                                <p className="text-gray-500 font-medium">no products found.</p>
                            ) : (
                                displayproducts.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded p-5 flex flex-col hover:border-[#1B3B4D] transition-colors relative group bg-white">
                                        <div className="absolute top-4 left-4 bg-[#1B3B4D] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10">
                                            IN STOCK
                                        </div>
                                        <div className="h-56 flex items-center justify-center mb-6 p-4">
                                            {item.imageUrl !== null && item.imageUrl !== "" ? (
                                                <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <span className="text-gray-300 text-xs uppercase font-bold tracking-widest">no image</span>
                                            )}
                                        </div>
                                        <div className="text-center flex flex-col flex-grow">
                                            <h2 className="font-bold text-[15px] text-[#1B3B4D] mb-1 hover:text-gray-500 cursor-pointer">{item.name}</h2>
                                            <p className="text-xs text-gray-400 mb-4 line-clamp-1">{item.description}</p>
                                            <div className="mt-auto">
                                                <p className="font-bold text-[#1B3B4D] text-lg mb-5">৳{item.price.toFixed(2)}</p>
                                                <button onClick={() => addtocart(item)} className="w-full border border-[#1B3B4D] text-[#1B3B4D] py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#1B3B4D] hover:text-white transition-colors">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {toastmessage !== "" ? (
                <div className="fixed bottom-10 right-10 bg-[#1B3B4D] text-white px-8 py-4 rounded shadow-2xl font-bold uppercase tracking-wider text-xs z-50">
                    {toastmessage}
                </div>
            ) : null}
        </div>
    );
}