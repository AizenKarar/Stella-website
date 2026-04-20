"use client";
import { useState, useEffect } from "react";

export default function CartPage() {
    const [cartitems, setcartitems] = useState([]);
    const [totalprice, settotalprice] = useState(0);
    async function fetchcart() {
        try {
            const response = await fetch("/api/cart", { cache: "no-store" });
            if (response.ok === true) {
                const data = await response.json();
                setcartitems(data);
                let total = 0;
                for (let i = 0; i < data.length; i = i + 1) {
                    let itemprice = data[i].product.price;
                    let itemquantity = data[i].quantity;
                    total = total + (itemprice * itemquantity);
                }
                settotalprice(total);
            }
        } catch (error) {
            setcartitems([]);
        }
    }
    useEffect(() => {
        fetchcart();
    }, []);
    async function removeitem(cartitemid) {
        await fetch("/api/cart?id=" + cartitemid, {
            method: "DELETE"
        });
        fetchcart();
    }
    async function updatequantity(cartitemid, action) {
        await fetch("/api/cart", {
            method: "PUT",
            body: JSON.stringify({ cartitemid: cartitemid, action: action })
        });
        fetchcart();
    }
    return (
        <div className="p-10 font-sans bg-[#2C2B30] min-h-screen flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-bold mb-10 text-center text-[#F2C4CE] uppercase tracking-widest 
                border-b border-[#F2C4CE]/30 pb-6">shopping cart</h1>
                {cartitems.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-[#F2C4CE] text-2xl uppercase tracking-widest font-bold">your cart is empty</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {cartitems.map((item) => (
                            <div key={item.id} className="bg-[#2C2B30] p-6 rounded border border-[#F2C4CE]/30 flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-6">
                                    <div className="h-24 w-24 bg-white rounded flex items-center justify-center p-2">
                                        {item.product.imageUrl !== null && item.product.imageUrl !== "" ? (
                                            <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain" />
                                        ) : (
                                            <span className="text-black text-xs font-bold">no image</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl font-bold text-[#F2C4CE]">{item.product.name}</h2>
                                        <p className="text-[#F2C4CE] font-bold text-xl">৳{item.product.price.toFixed(2)}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-[#F2C4CE] uppercase tracking-wide text-sm opacity-80">quantity:</p>
                                            <div className="flex items-center gap-3 bg-[#232227] px-3 py-1 rounded border border-[#F2C4CE]/30">
                                                <button onClick={() => updatequantity(item.id, "decrease")} className="text-[#F2C4CE] font-bold hover:opacity-70">-</button>
                                                <span className="text-white font-bold">{item.quantity}</span>
                                                <button onClick={() => updatequantity(item.id, "increase")} className="text-[#F2C4CE] font-bold hover:opacity-70">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeitem(item.id)} className="border border-[#F2C4CE] text-[#F2C4CE] px-6 py-3 rounded font-bold 
                                uppercase tracking-wider hover:bg-[#F2C4CE] hover:text-[#2C2B30] transition-colors">remove</button>
                            </div>
                        ))}
                        <div className="bg-[#2C2B30] p-8 rounded border border-[#F2C4CE]/30 mt-8 flex flex-col items-end shadow-xl">
                            <p className="text-[#F2C4CE] uppercase tracking-widest font-bold mb-2 opacity-80">total amount</p>
                            <p className="text-5xl font-bold text-[#F2C4CE] mb-8">৳{totalprice.toFixed(2)}</p>
                            <a href="/checkout" className="bg-[#F2C4CE] text-[#2C2B30] px-10 py-4 rounded font-bold text-xl uppercase tracking-widest 
                            hover:opacity-80 transition-opacity w-full text-center">Proceed to Checkout</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}