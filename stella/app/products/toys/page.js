"use client";
import { useState, useEffect } from "react";

export default function ToysPage() {
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
            <div className="p-10 flex justify-center items-center h-screen bg-[#2C2B30]">
                <p className="text-[#F2C4CE] font-bold text-xl uppercase tracking-widest animate-pulse">loading...</p>
            </div>
        );
    }
    return (
        <div className="p-10 font-sans bg-[#2C2B30] min-h-screen relative">
            <div className="flex justify-between items-center mb-10 border-b border-[#F2C4CE]/30 pb-6">
                <h1 className="text-4xl font-bold text-[#F2C4CE] tracking-wider uppercase">
                    TOYS
                </h1>
                <div className="flex items-center gap-4">
                    <label className="text-[#F2C4CE] font-bold uppercase tracking-wide">filter for:</label>
                    <select
                        className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-[#F2C4CE] p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                        value={animalfilter}
                        onChange={(e) => setanimalfilter(e.target.value)}
                    >
                        <option value="ALL">all pets</option>
                        <option value="CAT">cats only</option>
                        <option value="DOG">dogs only</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {displayproducts.length === 0 ? (
                    <p className="text-[#F2C4CE] text-lg col-span-full text-center mt-10">no products found</p>
                ) : (
                    displayproducts.map((item) => (
                        <div key={item.id} className="bg-[#2C2B30] rounded border border-[#F2C4CE]/30 overflow-hidden flex flex-col shadow-xl">
                            <div className="h-64 bg-white flex items-center justify-center p-4">
                                {item.imageUrl !== null && item.imageUrl !== "" ? (
                                    <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain" />
                                ) : (
                                    <span className="text-black font-bold">no image</span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-[#F2C4CE] mb-2">{item.name}</h2>
                                <p className="text-[#F2C4CE] text-sm mb-4 flex-grow opacity-70">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold text-[#F2C4CE]">৳{item.price.toFixed(2)}</span>
                                    <button onClick={() => addtocart(item)} className="bg-[#F2C4CE] text-[#2C2B30] 
                                    px-4 py-2 rounded font-bold uppercase text-sm tracking-wider hover:opacity-80 
                                    transition-opacity">buy</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {toastmessage !== "" ? (
                <div className="fixed bottom-10 right-10 bg-[#F2C4CE] text-[#2C2B30] px-6 py-4 rounded shadow-2xl font-bold uppercase tracking-wider z-50">
                    {toastmessage}
                </div>
            ) : null}
        </div>
    );
}