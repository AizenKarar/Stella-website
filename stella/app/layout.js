import "./globals.css";
import Link from "next/link";

export const metadata = {
    title: 'Stella Pet Care',
    description: 'Most Reliable Pet Store',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-[#2C2B30] text-white min-h-screen flex flex-col font-sans">
                <header className="bg-[#232227] border-b border-[#F2C4CE]/30 p-4 sticky top-0 z-50">
                    <div className="max-w-[90%] mx-auto flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold text-[#F2C4CE] tracking-widest 
                        uppercase hover:opacity-80 transition-opacity">Stella</Link>
                        <nav className="flex items-center gap-8">
                            <div className="flex gap-8 items-center">
                                <div className="relative group">
                                    <button className="text-white font-bold text-lg uppercase tracking-wider flex items-center gap-2 group-hover:text-[#F2C4CE] transition-colors py-2">
                                        Products<span className="text-[#F2C4CE] text-sm mt-1">v</span>
                                    </button>
                                    <div className="absolute top-full left-0 pt-2 w-56 hidden group-hover:flex flex-col">
                                        <div className="bg-[#232227] border border-[#45444A] rounded shadow-2xl flex flex-col overflow-hidden">
                                            <a href="/products/toys" className="text-white p-4 hover:bg-[#35343A] hover:text-[#F2C4CE] 
                                            transition-colors uppercase font-bold tracking-wide border-b border-[#45444A]">Toys</a>
                                            <a href="/products/food" className="text-white p-4 hover:bg-[#35343A] hover:text-[#F2C4CE] 
                                            transition-colors uppercase font-bold tracking-wide border-b border-[#45444A]">Food</a>
                                        </div>
                                    </div>
                                </div>
                                <a href="/appointments" className="text-white font-bold text-lg uppercase tracking-wider hover:text-[#F2C4CE] 
                                transition-colors">Appointment</a>
                                <a href="/blogs" className="text-white font-bold text-lg uppercase tracking-wider hover:text-[#F2C4CE] 
                                transition-colors">Blog</a>
                                <a href="/cart" className="text-[#F2C4CE] hover:opacity-70 transition-opacity p-2 border border-[#F2C4CE]/30 rounded flex items-center justify-center ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </a>
                            </div>
                        </nav>
                    </div>
                </header>
                <main className="flex-grow">
                    {children}
                </main>
            </body>
        </html>
    )
}