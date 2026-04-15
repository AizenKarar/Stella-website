"use client";
import { useState, useEffect } from "react";

export default function ToysPage() {
    const [products, setproducts] = useState([]);
    const [animalfilter, setanimalfilter] = useState("ALL");
    const [isloading, setisloading] = useState(true);

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
                console.log(error);
                setproducts([]);
            } finally {
                setisloading(false);
            }
        }
        fetchproducts();
    }, [animalfilter]);

    let displayproducts = [];
    if (Array.isArray(products) === true) {
        for (let i = 0; i < products.length; i = i + 1) {
            displayproducts.push(products[i]);
        }
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center h-screen bg-[#2C2B30]">
                <p className="text-[#F2C4CE] font-bold text-xl uppercase tracking-widest animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-10 font-sans bg-[#2C2B30] min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b border-[#45444A] pb-6">
                <h1 className="text-4xl font-bold text-[#F2C4CE] tracking-wider uppercase">
                    TOYS
                </h1>
                <div className="flex items-center gap-4">
                    <label className="text-zinc-400 font-bold uppercase tracking-wide">Filter For:</label>
                    <select
                        className="bg-[#232227] border border-[#45444A] text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE] transition-colors"
                        value={animalfilter}
                        onChange={(e) => setanimalfilter(e.target.value)}
                    >
                        <option value="ALL">All Pets</option>
                        <option value="CAT">Cats Only</option>
                        <option value="DOG">Dogs Only</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {displayproducts.length === 0 ? (
                    <p className="text-zinc-400 text-lg col-span-full text-center mt-10">No products found.</p>
                ) : (
                    displayproducts.map((item) => (
                        <div key={item.id} className="bg-[#35343A] rounded-xl border border-[#45444A] overflow-hidden flex flex-col hover:border-[#F2C4CE] transition-colors duration-300 shadow-xl shadow-black/50">
                            <div className="h-64 bg-[#232227] flex items-center justify-center p-4">
                                {item.imageUrl !== null && item.imageUrl !== "" ? (
                                    <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain" />
                                ) : (
                                    <span className="text-zinc-600 font-bold">No Image</span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-white mb-2">{item.name}</h2>
                                <p className="text-zinc-400 text-sm mb-4 flex-grow">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold text-[#F2C4CE]">${item.price.toFixed(2)}</span>
                                    <button className="bg-[#F2C4CE] text-[#2C2B30] px-4 py-2 rounded font-bold uppercase text-sm tracking-wider hover:opacity-80 transition-opacity">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}