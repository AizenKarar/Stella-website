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
            <div className="p-10 flex justify-center items-center h-screen bg-[#2C2B30]">
                <p className="text-[#F2C4CE] font-bold text-xl uppercase tracking-widest animate-pulse">loading cart...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 font-sans bg-[#2C2B30] min-h-screen">
            <h1 className="text-4xl font-bold text-[#F2C4CE] tracking-wider uppercase mb-8 border-b border-[#F2C4CE]/30 pb-6">
                shopping cart
            </h1>

            {cartitems.length === 0 ? (
                <div className="text-center py-20 border border-[#F2C4CE]/30 rounded bg-[#232227] max-w-3xl mx-auto">
                    <p className="text-white text-xl uppercase tracking-widest mb-6">your cart is currently empty</p>
                    <Link href="/products/accessories">
                        <button className="bg-[#F2C4CE] text-[#2C2B30] px-8 py-3 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                            continue shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
                    <div className="flex-grow flex flex-col gap-6">
                        {cartitems.map((item) => (
                            <div key={item.id} className="bg-[#232227] border border-[#F2C4CE]/30 p-4 md:p-6 rounded flex flex-col md:flex-row gap-6 items-center md:items-start relative">
                                <div className="w-32 h-32 bg-white rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {item.product.imageUrl ? (
                                        <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain p-2" />
                                    ) : (
                                        <span className="text-black text-xs font-bold uppercase">no img</span>
                                    )}
                                </div>

                                <div className="flex flex-col flex-grow text-center md:text-left w-full">
                                    <h2 className="text-xl font-bold text-[#F2C4CE] mb-1">
                                        {item.product.name} {item.isCustom === true ? "(custom)" : ""}
                                    </h2>
                                    {item.isCustom === true ? (
                                        <p className="text-white opacity-70 text-sm mb-2">note: {item.customNote}</p>
                                    ) : null}
                                    <span className="text-white font-bold text-lg mb-4">
                                        ৳{item.isCustom === true ? (item.product.price + 100).toFixed(2) : item.product.price.toFixed(2)}
                                    </span>

                                    <div className="flex items-center justify-center md:justify-start gap-6 mt-auto">
                                        <div className="flex items-center border border-[#F2C4CE]/30 rounded bg-[#2C2B30]">
                                            <button onClick={() => updatequantity(item.id, item.quantity, -1)} className="text-[#F2C4CE] px-4 py-2 hover:bg-[#F2C4CE]/10 transition-colors font-bold text-lg">-</button>
                                            <span className="text-white font-bold px-4">{item.quantity}</span>
                                            <button onClick={() => updatequantity(item.id, item.quantity, 1)} className="text-[#F2C4CE] px-4 py-2 hover:bg-[#F2C4CE]/10 transition-colors font-bold text-lg">+</button>
                                        </div>
                                        <button onClick={() => removeitem(item.id)} className="text-red-400 text-sm font-bold uppercase tracking-wider underline hover:opacity-80 transition-opacity">
                                            remove
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:block text-right flex-shrink-0">
                                    <span className="text-[#F2C4CE] font-bold text-xl block">
                                        ৳{((item.isCustom === true ? item.product.price + 100 : item.product.price) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-[400px]">
                        <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded sticky top-24">
                            <h2 className="text-2xl font-bold text-[#F2C4CE] mb-6 uppercase">order summary</h2>
                            <div className="flex flex-col gap-4 border-b border-[#F2C4CE]/30 pb-6 mb-6 text-white">
                                <div className="flex justify-between items-center">
                                    <span className="opacity-80">subtotal ({cartitems.length} items)</span>
                                    <span className="font-bold text-xl text-[#F2C4CE]">৳{subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-sm opacity-60 mt-2">shipping and taxes calculated at checkout.</p>
                            </div>

                            <Link href="/checkout">
                                <button className="bg-[#F2C4CE] text-[#2C2B30] px-10 py-4 rounded font-bold uppercase tracking-widest text-lg hover:opacity-80 transition-opacity w-full">
                                    proceed to checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {toastmessage !== "" && (
                <div className="fixed bottom-10 right-10 bg-[#F2C4CE] text-[#2C2B30] px-6 py-4 rounded shadow-2xl font-bold uppercase tracking-wider z-50">
                    {toastmessage}
                </div>
            )}
        </div>
    );
}