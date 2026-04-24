"use client";
import Link from "next/link";

export default function dashboardpage() {
    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans text-[#333333] overflow-hidden relative">
            <nav className="flex justify-between items-center px-6 md:px-16 py-8 relative z-20">
                <div className="text-2xl font-black tracking-widest text-[#444444] uppercase">
                    stella
                </div>
                <div className="hidden md:flex gap-12 font-medium text-[#666666]">
                    <Link href="/products/accessories" className="hover:text-black transition-colors">products</Link>
                    <Link href="/cart" className="hover:text-black transition-colors">shop</Link>
                    <Link href="/checkout" className="hover:text-black transition-colors">learn</Link>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="/login" className="font-medium text-[#666666] hover:text-black transition-colors">login</Link>
                    <button className="bg-white px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-all text-[#444444]">
                        get started
                    </button>
                </div>
            </nav>

            <div className="flex flex-col md:flex-row items-center px-6 md:px-16 pt-10 md:pt-20 relative z-20">
                <div className="md:w-1/2 flex flex-col items-start gap-6 z-10">
                    <span className="bg-[#B5E48C] text-[#2C4A1B] px-5 py-2 rounded-full text-sm font-bold tracking-wide">
                        new
                    </span>
                    <h1 className="text-5xl md:text-6xl font-medium leading-[1.1] text-[#333333]">
                        nutrition, energy, and care—<br />
                        advanced by stella science
                    </h1>
                    <p className="text-[#777777] text-lg max-w-md leading-relaxed mt-2">
                        stella's pet biotics nourish your companions and their microbiome to deliver targeted, daily benefits.
                    </p>
                    <Link href="/products/accessories">
                        <button className="bg-white px-10 py-4 rounded-full font-bold shadow-sm hover:shadow-md transition-all mt-6 text-[#444444] text-lg">
                            shop now
                        </button>
                    </Link>
                </div>

                <div className="md:w-1/2 mt-20 md:mt-0 relative flex justify-center items-center h-[500px]">
                    <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#E5E7EB] to-transparent rounded-full opacity-50 blur-3xl"></div>

                    <div className="relative z-10 w-96 h-96 border border-[#CCCCCC] rounded-full border-dashed flex items-center justify-center animate-[spin_60s_linear_infinite]">
                        <div className="w-72 h-72 border border-[#CCCCCC] rounded-full border-dashed flex items-center justify-center">
                            <div className="w-40 h-40 bg-gradient-to-tr from-[#B5E48C] to-white rounded-full shadow-2xl flex items-center justify-center">
                                <span className="text-[#B5E48C] text-6xl">✨</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-10 left-20 bg-gradient-to-tr from-[#A1C181] to-white w-16 h-16 rounded-full shadow-lg transform -rotate-12"></div>
                    <div className="absolute bottom-20 right-10 bg-gradient-to-tr from-[#A1C181] to-white w-24 h-24 rounded-full shadow-xl transform rotate-45"></div>
                </div>
            </div>
        </div>
    );
}