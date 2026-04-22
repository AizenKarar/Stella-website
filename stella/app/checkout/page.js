"use client";
import { useState, useEffect } from "react";

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
        subtotal = subtotal + (cartitems[i].product.price * cartitems[i].quantity);
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
                    settoastmessage("locationiq api found address!");
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
                                <div className="w-full h-48 border border-[#F2C4CE]/30 rounded overflow-hidden">
                                    <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={mapurl}></iframe>
                                </div>
                                <div className="mb-2 pb-4 border-b border-[#F2C4CE]/10">
                                    <button onClick={getmylocation} disabled={islocating} className="bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] px-4 py-2 rounded font-bold uppercase tracking-widest text-sm hover:bg-[#F2C4CE] hover:text-[#2C2B30] transition-colors flex items-center gap-2">
                                        {islocating === true ? "calling api route..." : "📍 auto-fill address"}
                                    </button>
                                </div>
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
                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-white text-sm font-bold uppercase tracking-wider">phone number *</label>
                                    <input type="text" value={phonenumber} onChange={(e) => setphonenumber(e.target.value)} className="bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-3 rounded focus:outline-none focus:border-[#F2C4CE]" />
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
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
                            <div className="pl-4 text-white opacity-70 flex justify-between items-start">
                                <div>
                                    {firstname} {lastname} <br />
                                    {phonenumber} <br />
                                    {address}, {city}, {district} {zip}
                                </div>
                                <button onClick={() => setcurrentstep(1)} className="text-[#F2C4CE] underline text-sm uppercase tracking-wider font-bold">edit</button>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-2 uppercase pl-4">shipping method</h2>
                        {currentstep === 2 ? (
                            <div className="pl-4 mt-6 flex flex-col gap-4">
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input type="radio" name="shipping" value="standard" checked={shippingmethod === "standard"} onChange={(e) => setshippingmethod(e.target.value)} className="w-5 h-5 accent-[#F2C4CE]" />
                                    <div className="border border-[#F2C4CE]/30 p-4 rounded bg-[#2C2B30] flex-grow flex justify-between items-center">
                                        <div>
                                            <span className="text-white font-bold uppercase tracking-wider block">standard delivery</span>
                                            <span className="text-white opacity-60 text-sm">2-3 business days</span>
                                        </div>
                                        <span className="text-[#F2C4CE] font-bold">৳80</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input type="radio" name="shipping" value="express" checked={shippingmethod === "express"} onChange={(e) => setshippingmethod(e.target.value)} className="w-5 h-5 accent-[#F2C4CE]" />
                                    <div className="border border-[#F2C4CE]/30 p-4 rounded bg-[#2C2B30] flex-grow flex justify-between items-center">
                                        <div>
                                            <span className="text-white font-bold uppercase tracking-wider block">express delivery</span>
                                            <span className="text-white opacity-60 text-sm">same day delivery</span>
                                        </div>
                                        <span className="text-[#F2C4CE] font-bold">৳240</span>
                                    </div>
                                </label>
                                <button onClick={() => setcurrentstep(3)} className="bg-[#F2C4CE] text-[#2C2B30] px-6 py-3 mt-4 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity self-start">
                                    continue to payment
                                </button>
                            </div>
                        ) : currentstep > 2 ? (
                            <div className="pl-4 text-white opacity-70 flex justify-between items-start mt-4">
                                <span>{shippingmethod === "standard" ? "standard delivery (৳80)" : "express delivery (৳240)"}</span>
                                <button onClick={() => setcurrentstep(2)} className="text-[#F2C4CE] underline text-sm uppercase tracking-wider font-bold">edit</button>
                            </div>
                        ) : null}
                    </div>

                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-2 uppercase pl-4">payment</h2>
                        {currentstep === 3 ? (
                            <div className="pl-4 mt-6">
                                <div className="border border-[#F2C4CE] p-4 rounded bg-[#2C2B30]">
                                    <h3 className="text-white font-bold uppercase tracking-wider mb-2">cash on delivery</h3>
                                    <p className="text-white opacity-70 text-sm">pay with cash when your order is delivered to your address. no credit card required.</p>
                                </div>
                                <button onClick={() => setcurrentstep(4)} className="bg-[#F2C4CE] text-[#2C2B30] px-6 py-3 mt-6 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                    review order
                                </button>
                            </div>
                        ) : currentstep > 3 ? (
                            <div className="pl-4 text-white opacity-70 flex justify-between items-start mt-4">
                                <span>cash on delivery</span>
                                <button onClick={() => setcurrentstep(3)} className="text-[#F2C4CE] underline text-sm uppercase tracking-wider font-bold">edit</button>
                            </div>
                        ) : null}
                    </div>

                    <div className="bg-[#232227] border border-[#F2C4CE]/30 p-6 rounded relative">
                        <div className="absolute -left-4 top-6 bg-[#2C2B30] border border-[#F2C4CE] text-[#F2C4CE] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                        <h2 className="text-2xl font-bold text-[#F2C4CE] mb-2 uppercase pl-4">review & place order</h2>
                        {currentstep === 4 && (
                            <div className="pl-4 mt-6">
                                <div className="bg-[#2C2B30] border border-[#F2C4CE]/30 rounded p-6 mb-8">
                                    <h3 className="text-[#F2C4CE] font-bold uppercase tracking-widest mb-4 border-b border-[#F2C4CE]/30 pb-2">order summary details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                                        <div>
                                            <span className="opacity-60 uppercase tracking-wider text-sm block mb-1">shipping to:</span>
                                            <span className="font-bold block">{firstname} {lastname}</span>
                                            <span className="block">{phonenumber}</span>
                                            <span className="block mt-1">{address}</span>
                                            <span className="block">{city}, {district} {zip}</span>
                                        </div>
                                        <div>
                                            <span className="opacity-60 uppercase tracking-wider text-sm block mb-1">delivery method:</span>
                                            <span className="font-bold block">{shippingmethod === "standard" ? "standard delivery (2-3 days)" : "express delivery (same day)"}</span>
                                            <span className="opacity-60 uppercase tracking-wider text-sm block mb-1 mt-4">payment method:</span>
                                            <span className="font-bold block">cash on delivery</span>
                                        </div>
                                    </div>
                                </div>
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
                                <span className="text-[#F2C4CE] font-bold uppercase">৳{shippingcost.toFixed(2)}</span>
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