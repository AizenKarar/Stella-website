"use client";
import { useState, useEffect } from "react";

export default function checkoutpage() {
    const [cartitems, setcartitems] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [toastmessage, settoastmessage] = useState("");
    const [currentstep, setcurrentstep] = useState(1);
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [address, setaddress] = useState("");
    const [city, setcity] = useState("");
    const [district, setdistrict] = useState("");
    const [zip, setzip] = useState("");

    useEffect(() => {
        async function fetchcart() {
            setisloading(true);
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
        fetchcart();
    }, []);

    let subtotal = 0;
    for (let i = 0; i < cartitems.length; i = i + 1) {
        subtotal = subtotal + (cartitems[i].product.price * cartitems[i].quantity);
    }
    const shippingcost = 0;
    const total = subtotal + shippingcost;

    async function handleplaceorder() {
        if (cartitems.length === 0) {
            settoastmessage("your cart is empty!");
            setTimeout(() => settoastmessage(""), 3000);
            return;
        }
        const fulladdress = firstname + " " + lastname + ", " + address + ", " + city + ", " + district + " " + zip;
        try {
            settoastmessage("processing order...");
            const response = await fetch("/api/checkout", {
                method: "POST",
                body: JSON.stringify({
                    email: "customer@email.com",
                    address: fulladdress
                })
            });
            const data = await response.json();
            if (data.success === true) {
                settoastmessage("order placed successfully!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                settoastmessage("failed to place order.");
            }
        } catch (error) {
            settoastmessage("network error.");
        }
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center h-screen bg-[#2C2B30]">
                <p className="text-[#F2C4CE] font-bold text-xl uppercase tracking-widest animate-pulse">loading checkout...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 font-sans bg-[#2C2B30] min-h-screen">
            <h1 className="text-4xl font-bold text-[#F2C4CE] tracking-wider uppercase mb-8 border-b border-[#F2C4CE]/30 pb-6">
                checkout
            </h1>
            <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
                <div className="flex-grow flex flex-col gap-6">
                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#F2C4CE] text-[#2C2B30] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-6 uppercase pl-4">shipping address</h2>
                        {currentstep === 1 ? (
                            <div className="flex flex-col gap-4 pl-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-white text-sm font-bold uppercase tracking-wider">first name *</label>
                                        <input type="text" value={firstname} onChange={(e) => setfirstname(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-white text-sm font-bold uppercase tracking-wider">last name *</label>
                                        <input type="text" value={lastname} onChange={(e) => setlastname(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-bold uppercase tracking-wider">address *</label>
                                    <input type="text" value={address} onChange={(e) => setaddress(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-white text-sm font-bold uppercase tracking-wider">zip code *</label>
                                        <input type="text" value={zip} onChange={(e) => setzip(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-white text-sm font-bold uppercase tracking-wider">city *</label>
                                        <input type="text" value={city} onChange={(e) => setcity(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-white text-sm font-bold uppercase tracking-wider">district *</label>
                                        <input type="text" value={district} onChange={(e) => setdistrict(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                    </div>
                                </div>
                                <button onClick={() => setcurrentstep(2)} className="bg-[#F2C4CE] text-[#2C2B30] px-6 py-3 mt-4 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity w-full md:w-auto self-start">
                                    continue to shipping method
                                </button>
                            </div>
                        ) : (
                            <div className="pl-4 text-white opacity-70">
                                {firstname} {lastname} <br />
                                {address}, {city}, {district} {zip}
                            </div>
                        )}
                    </div>
                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-2 uppercase pl-4">shipping method</h2>
                        {currentstep === 2 && (
                            <div className="pl-4 mt-6">
                                <div className="border border-[#F2C4CE] p-4 rounded bg-[#2C2B30] flex justify-between items-center">
                                    <span className="text-white font-bold uppercase tracking-wider">standard delivery</span>
                                    <span className="text-[#F2C4CE] font-bold">free</span>
                                </div>
                                <button onClick={() => setcurrentstep(3)} className="bg-[#F2C4CE] text-[#2C2B30] px-6 py-3 mt-6 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                    continue to payment
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-2 uppercase pl-4">payment</h2>
                        {currentstep === 3 && (
                            <div className="pl-4 mt-6">
                                <div className="border border-[#F2C4CE] p-4 rounded bg-[#2C2B30]">
                                    <h3 className="text-white font-bold uppercase tracking-wider mb-2">cash on delivery</h3>
                                    <p className="text-white opacity-70 text-sm">pay with cash when your order is delivered to your address. no credit card required.</p>
                                </div>
                                <button onClick={() => setcurrentstep(4)} className="bg-[#F2C4CE] text-[#2C2B30] px-6 py-3 mt-6 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                    review order
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-2 uppercase pl-4">review & place order</h2>
                        {currentstep === 4 && (
                            <div className="pl-4 mt-6">
                                <p className="text-white opacity-70 mb-6">please review your summary on the right before placing the order.</p>
                                <button onClick={handleplaceorder} className="bg-[#F2C4CE] text-[#2C2B30] px-10 py-4 rounded font-bold uppercase tracking-widest text-lg hover:opacity-80 transition-opacity w-full">
                                    place order
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full lg:w-[400px]">
                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded sticky top-24">
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-6 uppercase">summary</h2>
                        <div className="flex flex-col gap-4 border-b border-[#F2C4CE]/30 pb-6 mb-6 text-white">
                            <div className="flex justify-between">
                                <span className="opacity-80">subtotal</span>
                                <span>৳{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">shipping</span>
                                <span className="text-[#F2C4CE] font-bold uppercase">free</span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-[#F2C4CE]/10 text-xl font-bold text-[#F2C4CE]">
                                <span>total</span>
                                <span>৳{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-[#F2C4CE] mb-4 uppercase flex items-center gap-2">
                            🛒 cart ({cartitems.length} items)
                        </h3>
                        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                            {cartitems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-start border-b border-[#45444A] pb-4">
                                    <div className="w-20 h-20 bg-white rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {item.product.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain p-1" />
                                        ) : (
                                            <span className="text-black text-xs font-bold uppercase">no img</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{item.product.name}</span>
                                        <span className="text-[#F2C4CE] font-bold mt-1">৳{item.product.price}</span>
                                        <span className="text-white opacity-60 text-sm mt-1">qty: {item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {toastmessage !== "" && (
                <div className="fixed bottom-10 right-10 bg-[#F2C4CE] text-[#2C2B30] px-6 py-4 rounded shadow-2xl font-bold uppercase tracking-wider z-50">
                    {toastmessage}
                </div>
            )}
        </div>
    );
}