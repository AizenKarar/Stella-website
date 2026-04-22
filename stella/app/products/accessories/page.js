"use client";
import { useState, useEffect } from "react";

export default function AccessoriesPage() {
    const [products, setproducts] = useState([]);
    const [animalfilter, setanimalfilter] = useState("ALL");
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
                let myurl = "/api/accessories";
                if (animalfilter !== "ALL") {
                    myurl = myurl + "?animal=" + animalfilter;
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

    async function submitcustomorder() {
        if (selectedcustomid === "") {
            settoastmessage("please search and select an accessory first");
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
            const response = await fetch("/api/custom", {
                method: "POST",
                body: JSON.stringify({
                    productid: selectedcustomid,
                    description: customdescription
                })
            });
            const data = await response.json();

            if (data.success === true) {
                settoastmessage("custom order submitted successfully!");
                setselectedcustomid("");
                setcustomdescription("");
                setsearchterm("");
            } else {
                settoastmessage("failed to submit custom order.");
            }
        } catch (error) {
            settoastmessage("network error occurred.");
        } finally {
            setiscustomloading(false);
            setTimeout(() => settoastmessage(""), 3000);
        }
    }
    let displayproducts = [];
    let selectedproduct = null;
    if (Array.isArray(products) === true) {
        for (let i = 0; i < products.length; i = i + 1) {
            displayproducts.push(products[i]);
            if (products[i].id === selectedcustomid) {
                selectedproduct = products[i];
            }
        }
    }

    let searchresults = [];
    if (searchterm !== "") {
        for (let i = 0; i < displayproducts.length; i = i + 1) {
            if (displayproducts[i].name.toLowerCase().includes(searchterm.toLowerCase())) {
                searchresults.push(displayproducts[i]);
            }
        }
    }

    if (selectedproduct !== null && searchterm === selectedproduct.name) {
        searchresults = [];
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
                    accessories
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
                                    <span className="text-black font-bold uppercase">no image</span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-[#F2C4CE] mb-2">{item.name}</h2>
                                <p className="text-[#F2C4CE] text-sm mb-4 flex-grow opacity-70">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold text-[#F2C4CE]">৳{item.price.toFixed(2)}</span>
                                    <button onClick={() => addtocart(item)} className="bg-[#F2C4CE] text-[#2C2B30] px-4 py-2 rounded font-bold uppercase text-sm tracking-wider hover:opacity-80 transition-opacity">
                                        buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-20 border-t-2 border-[#F2C4CE] pt-10 flex flex-col items-center">
                <h2 className="text-4xl font-bold text-[#F2C4CE] tracking-wider uppercase mb-8 text-center">
                    custom order
                </h2>

                <div className="flex flex-col items-center gap-6 w-full max-w-4xl">

                    <div className="w-full md:w-1/2 relative flex flex-col items-center z-40">
                        <input
                            type="text"
                            placeholder="search for an accessory..."
                            value={searchterm}
                            onChange={(e) => {
                                setsearchterm(e.target.value);
                                setselectedcustomid("");
                            }}
                            className="w-full bg-[#2C2B30] border border-[#F2C4CE]/30 text-[#F2C4CE] p-4 rounded focus:outline-none focus:border-[#F2C4CE] text-center"
                        />
                        {searchresults.length > 0 ? (
                            <div className="absolute top-full mt-1 w-full bg-[#232227] border border-[#F2C4CE]/30 rounded shadow-2xl max-h-48 overflow-y-auto">
                                {searchresults.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setselectedcustomid(item.id);
                                            setsearchterm(item.name);
                                        }}
                                        className="p-4 hover:bg-[#35343A] cursor-pointer border-b border-[#45444A] text-[#F2C4CE] text-center"
                                    >
                                        {item.name} (৳{item.price})
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="w-64 h-64 border border-[#F2C4CE]/30 bg-white rounded flex flex-col items-center justify-center overflow-hidden">
                        {selectedproduct !== null && selectedproduct.imageUrl !== null && selectedproduct.imageUrl !== "" ? (
                            <img src={selectedproduct.imageUrl} alt="preview" className="max-h-full object-contain p-2" />
                        ) : (
                            <span className="text-black font-bold uppercase tracking-widest text-sm text-center px-4">
                                select a product to see picture
                            </span>
                        )}
                    </div>

                    <textarea
                        value={customdescription}
                        onChange={(e) => setcustomdescription(e.target.value)}
                        placeholder="example: i want this item in gold color..."
                        className="w-full bg-[#2C2B30] border border-[#F2C4CE]/30 text-white p-4 rounded focus:outline-none focus:border-[#F2C4CE] resize-none h-40 text-center"
                    ></textarea>
                    <div className="flex flex-col items-center mt-2 w-full">
                        {selectedproduct !== null ? (
                            <div className="text-center mb-6">
                                <p className="text-[#F2C4CE] font-bold opacity-80 uppercase text-sm tracking-wider">
                                    base price: ৳{selectedproduct.price.toFixed(2)} <br />
                                    custom fee: ৳100.00
                                </p>
                                <span className="text-3xl font-bold text-[#F2C4CE] mt-2 block tracking-widest">
                                    total: ৳{(selectedproduct.price + 100).toFixed(2)}
                                </span>
                            </div>
                        ) : null}

                        <button onClick={submitcustomorder} disabled={iscustomloading} className="bg-[#F2C4CE] text-[#2C2B30] px-12 py-4 rounded font-bold uppercase tracking-widest hover:opacity-80 transition-opacity w-full md:w-1/2">
                            {iscustomloading === true ? "sending..." : "submit order"}
                        </button>
                    </div>
                </div>
            </div>

            {toastmessage !== "" ? (
                <div className="fixed bottom-10 right-10 bg-[#F2C4CE] text-[#2C2B30] px-6 py-4 rounded shadow-2xl font-bold uppercase tracking-wider z-50">
                    {toastmessage}
                </div>
            ) : null}
        </div>
    );
}