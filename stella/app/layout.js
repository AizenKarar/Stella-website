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
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <Link href="/dashboard" className="text-2xl font-bold text-[#F2C4CE] tracking-widest uppercase hover:opacity-80 transition-opacity">
                            Stella
                        </Link>
                        <nav>
                            <div className="flex gap-12 items-center ml-10">
                                <div className="relative group">
                                    <button className="text-white font-bold text-0.5xl uppercase tracking-wider flex items-center gap-2 group-hover:text-[#F2C4CE] transition-colors py-2">
                                        Products<span className="text-[#F2C4CE] text-sm mt-1">V</span>
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
                                <a href="/appointments" className="text-white font-bold text-0.5xl uppercase tracking-wider hover:text-[#F2C4CE]
                                 transition-colors">Appointment</a>
                                <a href="/blogs" className="text-white font-bold text-0.5xl uppercase tracking-wider hover:text-[#F2C4CE] 
                                 transition-colors">Blog</a>
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