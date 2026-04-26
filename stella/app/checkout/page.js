"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function checkoutpage() {
    const [cartitems, setcartitems] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [toastmessage, settoastmessage] = useState("");
    const [currentstep, setcurrentstep] = useState(1);
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [address, setaddress] = useState("");
    const [city, setcity] = useState("");
    const [district, setdistrict] = useState("");
    const [zip, setzip] = useState("");
    const [shippingmethod, setshippingmethod] = useState("standard");
    const [islocating, setislocating] = useState(false);
    const [mapurl, setmapurl] = useState("https://www.openstreetmap.org/export/embed.html?bbox=90.29,23.67,90.31,23.69&layer=mapnik");

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
        let currentprice = cartitems[i].product.price;
        if (cartitems[i].isCustom === true) {
            currentprice = currentprice + 100;
        }
        subtotal = subtotal + (currentprice * cartitems[i].quantity);
    }
    let shippingcost = 80;
    if (shippingmethod === "express") {
        shippingcost = 240;
    }

    const total = subtotal + shippingcost;

    function getmylocation() {
        if (!navigator.geolocation) {
            settoastmessage("browser does not support location");
            setTimeout(() => settoastmessage(""), 3000);
            return;
        }
        setislocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            setmapurl("https://www.openstreetmap.org/export/embed.html?bbox=" + (lon - 0.005) + "," + (lat - 0.005) + "," + (lon + 0.005) + "," + (lat + 0.005) + "&layer=mapnik&marker=" + lat + "," + lon);

            try {
                const response = await fetch("/api/location", {
                    method: "POST",
                    body: JSON.stringify({ lat: lat, lon: lon })
                });
                const data = await response.json();

                if (data.address) {
                    if (data.address.road || data.address.suburb || data.address.neighbourhood) {
                        setaddress(data.address.road || data.address.suburb || data.address.neighbourhood || "");
                    }
                    if (data.address.city || data.address.town || data.address.county) {
                        setcity(data.address.city || data.address.town || data.address.county || "");
                    }
                    if (data.address.state_district || data.address.state) {
                        setdistrict(data.address.state_district || data.address.state || "");
                    }
                    if (data.address.postcode) {
                        setzip(data.address.postcode);
                    }
                    settoastmessage("location api found address!");
                }
            } catch (error) {
                settoastmessage("failed to connect to location api");
            } finally {
                setislocating(false);
                setTimeout(() => settoastmessage(""), 3000);
            }
        }, () => {
            setislocating(false);
            settoastmessage("please allow location access in your browser");
            setTimeout(() => settoastmessage(""), 3000);
        });
    }

    async function handleplaceorder() {
        if (cartitems.length === 0) {
            settoastmessage("your cart is empty!");
            setTimeout(() => settoastmessage(""), 3000);
            return;
        }
        if (phonenumber === "") {
            settoastmessage("please enter a phone number");
            setTimeout(() => settoastmessage(""), 3000);
            return;
        }

        const fulladdress = firstname + " " + lastname + "\nphone: " + phonenumber + "\n" + address + "\n" + city + ", " + district + " " + zip;
        try {
            settoastmessage("processing order...");
            const response = await fetch("/api/checkout", {
                method: "POST",
                body: JSON.stringify({
                    email: "anjum.haque.shruti@g.bracu.ac.bd",
                    address: fulladdress,
                    paymentmethod: "cash on delivery",
                    deliverymethod: shippingmethod + " delivery"
                })
            });
            const data = await response.json();
            if (data.success === true) {
                settoastmessage("order placed successfully! check your email.");
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            } else {
                settoastmessage("failed to place order.");
            }
        } catch (error) {
            settoastmessage("network error.");
        }
    }

    if (isloading === true) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen bg-white">
                <p className="text-[#1B3B4D] font-bold text-sm uppercase tracking-[0.2em] animate-pulse">secure connection...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#1B3B4D] p-6 md:p-12 pb-32 relative">
            <div className="max-w-[1400px] mx-auto">

                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3B4D] pb-6 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Secure<br />Checkout.
                        </h1>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        stella pet care // final step
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">

                    <div className="flex-grow flex flex-col gap-10">

                        {/* STEP 1: ADDRESS */}
                        <div className={`border-t-4 border-[#1B3B4D] bg-[#FAFAFA] p-8 md:p-10 transition-all ${currentstep === 1 ? 'shadow-lg bg-white' : ''}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-widest text-[#1B3B4D] flex items-center gap-4">
                                    <span className="text-sm border border-[#1B3B4D] px-2 py-1">01.</span> shipping address
                                </h2>
                                {currentstep > 1 && (
                                    <button onClick={() => setcurrentstep(1)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#1B3B4D] underline underline-offset-4">edit</button>
                                )}
                            </div>

                            {currentstep === 1 ? (
                                <div className="flex flex-col gap-6">
                                    <div className="w-full h-56 border border-gray-300 relative overflow-hidden bg-gray-100">
                                        <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={mapurl}></iframe>
                                    </div>
                                    <div className="mb-4">
                                        <button onClick={getmylocation} disabled={islocating} className="border border-[#1B3B4D] text-[#1B3B4D] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1B3B4D] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2">
                                            {islocating === true ? "detecting..." : "📍 auto-fill from map"}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">first name *</label>
                                            <input type="text" value={firstname} onChange={(e) => setfirstname(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">last name *</label>
                                            <input type="text" value={lastname} onChange={(e) => setlastname(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">phone number *</label>
                                        <input type="text" value={phonenumber} onChange={(e) => setphonenumber(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">address *</label>
                                        <input type="text" value={address} onChange={(e) => setaddress(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">zip code *</label>
                                            <input type="text" value={zip} onChange={(e) => setzip(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">city *</label>
                                            <input type="text" value={city} onChange={(e) => setcity(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 text-gray-500">district *</label>
                                            <input type="text" value={district} onChange={(e) => setdistrict(e.target.value)} className="w-full bg-transparent border border-gray-300 text-[#1B3B4D] p-4 focus:outline-none focus:border-[#1B3B4D] transition-colors font-medium text-sm" />
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-6">
                                        <button onClick={() => setcurrentstep(2)} className="bg-[#1B3B4D] text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors self-start">
                                            continue to delivery
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600 text-sm leading-relaxed font-medium">
                                    <p className="uppercase tracking-widest text-[#1B3B4D] font-bold mb-1">{firstname} {lastname}</p>
                                    <p>{address}</p>
                                    <p>{city}, {district} {zip}</p>
                                    <p className="mt-2 text-gray-400">T: {phonenumber}</p>
                                </div>
                            )}
                        </div>

                        {/* STEP 2: SHIPPING */}
                        <div className={`border-t-4 border-gray-200 bg-[#FAFAFA] p-8 md:p-10 transition-all ${currentstep === 2 ? 'border-[#1B3B4D] shadow-lg bg-white' : ''}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className={`text-2xl font-black uppercase tracking-widest flex items-center gap-4 ${currentstep >= 2 ? 'text-[#1B3B4D]' : 'text-gray-300'}`}>
                                    <span className={`text-sm border px-2 py-1 ${currentstep >= 2 ? 'border-[#1B3B4D]' : 'border-gray-300'}`}>02.</span> shipping method
                                </h2>
                                {currentstep > 2 && (
                                    <button onClick={() => setcurrentstep(2)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#1B3B4D] underline underline-offset-4">edit</button>
                                )}
                            </div>

                            {currentstep === 2 ? (
                                <div className="flex flex-col gap-6">
                                    <label className={`border p-6 flex justify-between items-center cursor-pointer transition-colors ${shippingmethod === "standard" ? "border-[#1B3B4D] bg-[#FAFAFA]" : "border-gray-200 hover:border-gray-400"}`}>
                                        <div className="flex items-center gap-6">
                                            <input type="radio" name="shipping" value="standard" checked={shippingmethod === "standard"} onChange={(e) => setshippingmethod(e.target.value)} className="w-5 h-5 accent-[#1B3B4D]" />
                                            <div>
                                                <span className="font-bold uppercase tracking-[0.1em] text-sm block mb-1">Standard Delivery</span>
                                                <span className="text-gray-500 text-xs">Arrives in 2-3 business days</span>
                                            </div>
                                        </div>
                                        <span className="font-black text-lg">৳80</span>
                                    </label>

                                    <label className={`border p-6 flex justify-between items-center cursor-pointer transition-colors ${shippingmethod === "express" ? "border-[#1B3B4D] bg-[#FAFAFA]" : "border-gray-200 hover:border-gray-400"}`}>
                                        <div className="flex items-center gap-6">
                                            <input type="radio" name="shipping" value="express" checked={shippingmethod === "express"} onChange={(e) => setshippingmethod(e.target.value)} className="w-5 h-5 accent-[#1B3B4D]" />
                                            <div>
                                                <span className="font-bold uppercase tracking-[0.1em] text-sm block mb-1">Express Delivery</span>
                                                <span className="text-gray-500 text-xs">Same day delivery (Order before 2 PM)</span>
                                            </div>
                                        </div>
                                        <span className="font-black text-lg">৳240</span>
                                    </label>

                                    <div className="mt-4 border-t border-gray-200 pt-6">
                                        <button onClick={() => setcurrentstep(3)} className="bg-[#1B3B4D] text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors self-start">
                                            continue to payment
                                        </button>
                                    </div>
                                </div>
                            ) : currentstep > 2 ? (
                                <div className="text-gray-600 text-sm font-medium">
                                    <span className="uppercase tracking-widest text-[#1B3B4D] font-bold">{shippingmethod} Delivery</span>
                                    <span className="text-gray-400 ml-4">({shippingmethod === "standard" ? "৳80" : "৳240"})</span>
                                </div>
                            ) : null}
                        </div>

                        {/* STEP 3: PAYMENT */}
                        <div className={`border-t-4 border-gray-200 bg-[#FAFAFA] p-8 md:p-10 transition-all ${currentstep === 3 ? 'border-[#1B3B4D] shadow-lg bg-white' : ''}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className={`text-2xl font-black uppercase tracking-widest flex items-center gap-4 ${currentstep >= 3 ? 'text-[#1B3B4D]' : 'text-gray-300'}`}>
                                    <span className={`text-sm border px-2 py-1 ${currentstep >= 3 ? 'border-[#1B3B4D]' : 'border-gray-300'}`}>03.</span> payment
                                </h2>
                                {currentstep > 3 && (
                                    <button onClick={() => setcurrentstep(3)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#1B3B4D] underline underline-offset-4">edit</button>
                                )}
                            </div>

                            {currentstep === 3 ? (
                                <div className="flex flex-col gap-6">
                                    <div className="border border-[#1B3B4D] bg-[#FAFAFA] p-6 flex items-start gap-4">
                                        <div className="mt-1 w-4 h-4 bg-[#1B3B4D] rounded-none"></div>
                                        <div>
                                            <h3 className="font-bold uppercase tracking-[0.1em] text-sm mb-2 text-[#1B3B4D]">Cash on Delivery</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">Pay with exact cash when your order is delivered to your address. No credit card required at this time.</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-6">
                                        <button onClick={() => setcurrentstep(4)} className="bg-[#1B3B4D] text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors self-start">
                                            review order
                                        </button>
                                    </div>
                                </div>
                            ) : currentstep > 3 ? (
                                <div className="text-gray-600 text-sm font-medium">
                                    <span className="uppercase tracking-widest text-[#1B3B4D] font-bold">Cash on Delivery</span>
                                </div>
                            ) : null}
                        </div>

                        {/* STEP 4: REVIEW */}
                        <div className={`border-t-4 border-gray-200 bg-[#FAFAFA] p-8 md:p-10 transition-all ${currentstep === 4 ? 'border-[#1B3B4D] shadow-lg bg-white' : ''}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className={`text-2xl font-black uppercase tracking-widest flex items-center gap-4 ${currentstep >= 4 ? 'text-[#1B3B4D]' : 'text-gray-300'}`}>
                                    <span className={`text-sm border px-2 py-1 ${currentstep >= 4 ? 'border-[#1B3B4D]' : 'border-gray-300'}`}>04.</span> review & finalize
                                </h2>
                            </div>

                            {currentstep === 4 && (
                                <div className="flex flex-col">
                                    <p className="text-gray-500 mb-8 text-sm">Please review your information above and the order summary on the right. If everything is correct, confirm your purchase below.</p>

                                    <button onClick={handleplaceorder} className="w-full bg-[#1B3B4D] text-white py-6 font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-colors shadow-[8px_8px_0px_0px_rgba(104,173,182,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 border border-[#1B3B4D]">
                                        authorize & place order
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="w-full lg:w-[450px] flex-shrink-0">
                        <div className="bg-[#FAFAFA] border border-[#1B3B4D] p-8 sticky top-10">
                            <h2 className="text-sm font-black text-[#1B3B4D] mb-8 uppercase tracking-[0.2em] border-b border-gray-300 pb-4">
                                order summary
                            </h2>

                            <div className="flex flex-col gap-6 max-h-96 overflow-y-auto pr-4 mb-8">
                                {cartitems.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-start border-b border-gray-200 pb-6">
                                        <div className="w-20 h-20 border border-gray-200 bg-white flex items-center justify-center p-2 flex-shrink-0">
                                            {item.product.imageUrl ? (
                                                <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <span className="text-gray-300 text-[8px] font-bold uppercase tracking-[0.2em]">no img</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <span className="text-[#1B3B4D] font-bold text-sm uppercase tracking-wider mb-1 leading-tight">
                                                {item.product.name} {item.isCustom === true ? "*" : ""}
                                            </span>
                                            <span className="text-gray-400 text-xs mb-2">Qty: {item.quantity}</span>
                                            <span className="text-[#1B3B4D] font-black">
                                                ৳{((item.isCustom === true ? item.product.price + 100 : item.product.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
                                <div className="flex justify-between">
                                    <span>subtotal</span>
                                    <span className="text-[#1B3B4D]">৳{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>shipping</span>
                                    <span className="text-[#1B3B4D]">৳{shippingcost.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-6 border-t border-[#1B3B4D]">
                                <span className="font-black text-[#1B3B4D] uppercase tracking-[0.2em] text-sm">total</span>
                                <span className="text-3xl font-black text-[#68ADB6]">৳{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {toastmessage !== "" && (
                <div className="fixed bottom-10 right-10 bg-[#1B3B4D] text-white px-8 py-5 border border-black font-bold uppercase tracking-[0.2em] text-[10px] z-50">
                    {toastmessage}
                </div>
            )}
        </div>
    );
}