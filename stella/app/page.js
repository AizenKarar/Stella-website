"use client";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="bg-[#FAFAFA] font-sans text-[#1B3B4D] overflow-hidden min-h-[calc(100vh-80px)] flex items-center relative">
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center relative z-20">

                <div className="md:w-1/2 flex flex-col items-start gap-8 z-10">
                    <div className="border border-[#68ADB6] bg-[#EEF6F7] text-[#1B3B4D] px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        New Collection
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#1B3B4D] tracking-tighter">
                        Nutrition, Energy,<br />
                        And Care—<br />
                        Advanced By<br />
                        Stella.
                    </h1>

                    <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed font-medium">
                        Stella's pet biotics nourish your companions and their microbiome to deliver targeted, daily benefits.
                    </p>

                    <Link href="/products/accessories">
                        <button className="mt-4 bg-[#1B3B4D] text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all border border-[#1B3B4D] shadow-[6px_6px_0px_0px_rgba(104,173,182,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5">
                            Shop Now
                        </button>
                    </Link>
                </div>

                <div className="md:w-1/2 mt-20 md:mt-0 relative flex justify-center items-center h-[600px] w-full">

                    <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-[#EEF6F7] to-transparent rounded-full opacity-50 blur-3xl"></div>

                    <div className="absolute w-[300px] h-[300px] border border-gray-200 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]"></div>
                    <div className="absolute w-[450px] h-[450px] border border-gray-200 rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
                    <div className="absolute w-[600px] h-[600px] border border-gray-100 rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>

                    <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-white to-[#EEF6F7] shadow-[0_20px_50px_rgba(104,173,182,0.2)] flex items-center justify-center border-2 border-white">
                        <span className="text-5xl drop-shadow-md">✨</span>
                    </div>

                    <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-gradient-to-br from-white to-[#D0E1E3] shadow-lg animate-bounce" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#EEF6F7] to-[#68ADB6] shadow-xl animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
                </div>

            </div>
        </div>
    );
}