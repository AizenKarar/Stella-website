"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function cartpage() {
    const [cartitems, setcartitems] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [toastmessage, settoastmessage] = useState("");

    async function fetchcart() {
        try {
            const response = await fetch("/api/cart", { cache: "no-store" });
            if (response.ok === true) {
                const data = await response.json();
                if (Array.isArray(data) === true) {
                    setcartitems(data);
                } else {
                    setcartitems([]);
                }
            }
        } catch (error) {
            setcartitems([]);
        } finally {
            setisloading(false);
        }
    }

    useEffect(() => {
        fetchcart();
    }, []);

    async function updatequantity(itemid, currentquantity, change) {
        const newquantity = currentquantity + change;
        if (newquantity < 1) {
            return;
        }
        try {
            const response = await fetch("/api/cart", {
                method: "PUT",
                body: JSON.stringify({
                    itemid: itemid,
                    quantity: newquantity
                })
            });
            if (response.ok === true) {
                fetchcart();
            }
        } catch (error) {
            settoastmessage("failed to update quantity");
            setTimeout(() => settoastmessage(""), 3000);
        }
    }

    async function removeitem(itemid) {
        try {
            const response = await fetch("/api/cart", {
                method: "DELETE",
                body: JSON.stringify({
                    itemid: itemid
                })
            });
            if (response.ok === true) {
                fetchcart();
                settoastmessage("item removed");
                setTimeout(() => settoastmessage(""), 3000);
            }
        } catch (error) {
            settoastmessage("failed to remove item");
            setTimeout(() => settoastmessage(""), 3000);
        }
    }

    let subtotal = 0;
    for (let i = 0; i < cartitems.length; i = i + 1) {
        let currentprice = cartitems[i].product.price;
        if (cartitems[i].isCustom === true) {
            currentprice = currentprice + 100;
        }
        subtotal = subtotal + (currentprice * cartitems[i].quantity);
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">loading bag...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 pb-32 relative">

            <div className="max-w-[1200px] mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3B4D] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Shopping<br />Bag.
                        </h1>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        stella pet care // checkout
                    </div>
                </header>

                {cartitems.length === 0 ? (
                    <div className="border border-gray-200 bg-[#FAFAFA] py-24 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl mb-6 opacity-20">🛍️</span>
                        <p className="text-[#1B3B4D] text-xs font-bold uppercase tracking-[0.2em] mb-8">your bag is currently empty.</p>
                        <Link href="/products/accessories">
                            <button className="bg-[#1B3B4D] text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors">
                                return to collection
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                        <div className="flex-grow flex flex-col gap-6">
                            {cartitems.map((item) => (
                                <div key={item.id} className="border border-gray-200 p-6 flex flex-col md:flex-row gap-8 items-start md:items-center relative bg-white hover:border-[#1B3B4D] transition-colors group">

                                    <div className="w-32 h-32 bg-[#FAFAFA] border border-gray-100 flex items-center justify-center p-4 flex-shrink-0">
                                        {item.product.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <span className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em]">no img</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-grow w-full">
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <h2 className="text-lg font-black uppercase tracking-wider text-[#1B3B4D] leading-tight">
                                                {item.product.name}
                                            </h2>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-[#1B3B4D]">
                                                    ৳{((item.isCustom === true ? item.product.price + 100 : item.product.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {item.isCustom === true ? (
                                            <p className="text-gray-500 text-xs font-medium bg-[#FAFAFA] p-3 border border-gray-100 mt-2 mb-4 leading-relaxed">
                                                <span className="font-bold uppercase tracking-wider text-[10px] block mb-1">bespoke note:</span>
                                                {item.customNote}
                                            </p>
                                        ) : (
                                            <div className="h-4"></div>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center border border-[#1B3B4D]">
                                                <button onClick={() => updatequantity(item.id, item.quantity, -1)} className="text-[#1B3B4D] px-4 py-2 hover:bg-[#FAFAFA] transition-colors font-bold text-lg leading-none">-</button>
                                                <span className="text-[#1B3B4D] font-bold px-4 text-sm border-x border-[#1B3B4D] py-2">{item.quantity}</span>
                                                <button onClick={() => updatequantity(item.id, item.quantity, 1)} className="text-[#1B3B4D] px-4 py-2 hover:bg-[#FAFAFA] transition-colors font-bold text-lg leading-none">+</button>
                                            </div>
                                            <button onClick={() => removeitem(item.id)} className="text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-red-700 underline underline-offset-4 transition-colors">
                                                remove
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className="w-full lg:w-[400px] flex-shrink-0">
                            <div className="bg-[#FAFAFA] border border-[#1B3B4D] p-8 md:p-10 sticky top-24">
                                <h2 className="text-sm font-bold text-[#1B3B4D] mb-8 uppercase tracking-[0.2em] border-b border-gray-200 pb-4">order summary</h2>

                                <div className="flex justify-between items-center mb-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <span>subtotal ({cartitems.length} items)</span>
                                    <span className="text-lg text-[#1B3B4D]">৳{subtotal.toFixed(2)}</span>
                                </div>

                                <div className="border-t border-[#1B3B4D] pt-6 mb-8">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.1em] leading-relaxed">
                                        shipping, taxes, and final costs will be calculated at the next step.
                                    </p>
                                </div>

                                <Link href="/checkout">
                                    <button className="w-full bg-[#1B3B4D] text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors">
                                        proceed to checkout
                                    </button>
                                </Link>

                                <Link href="/products/accessories">
                                    <p className="text-center mt-6 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-[#1B3B4D] underline underline-offset-4 cursor-pointer transition-colors">
                                        continue shopping
                                    </p>
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {toastmessage !== "" && (
                <div className="fixed bottom-10 right-10 bg-[#1B3B4D] text-white px-8 py-5 border border-black font-bold uppercase tracking-[0.2em] text-[10px] z-50">
                    {toastmessage}
                </div>
            )}
        </div>
    );
}