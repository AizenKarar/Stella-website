import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import "./globals.css";
import Link from "next/link";
import NavAuth from "./components/nav-auth";
const prisma = new PrismaClient();
export const metadata = {
    title: "stella pet care",
    description: "most reliable pet store"
};
export default async function RootLayout({ children }) {
    const authuser = await currentUser();
    let isadmin = false;
    if (authuser !== null) {
        const useremail = authuser.emailAddresses[0].emailAddress;
        const dbuser = await prisma.user.findUnique({
            where: { email: useremail }
        });
        if (dbuser !== null) {
            if (dbuser.role === "admin") {
                isadmin = true;
            }
        }
    }
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="bg-[#fafafa] text-[#1b3b4d] min-h-screen flex flex-col font-sans m-0 p-0 selection:bg-[#68adb6] selection:text-white">
                    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                        <div className="max-w-[90%] mx-auto flex justify-between items-center px-6 md:px-12 py-5">
                            <Link href="/" className="text-2xl font-black tracking-[0.2em] text-[#1b3b4d] uppercase hover:text-[#68adb6] transition-colors">stella</Link>
                            <nav className="flex items-center gap-10">
                                <div className="hidden md:flex gap-8 items-center font-bold text-xs uppercase tracking-[0.15em] text-[#1b3b4d]">
                                    <div className="relative group">
                                        <button className="uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[#68adb6] transition-colors py-2 font-bold text-xs">
                                            products <span className="text-[#68adb6] text-[10px] mt-0.5">▼</span>
                                        </button>
                                        <div className="absolute top-full left-0 pt-4 w-48 hidden group-hover:flex flex-col">
                                            <div className="bg-white border border-[#1b3b4d] flex flex-col shadow-[4px_4px_0px_0px_rgba(27,59,77,0.1)]">
                                                <a href="/products/toys" className="text-[#1b3b4d] p-4 hover:bg-[#1b3b4d] hover:text-white transition-colors border-b border-gray-100">toys</a>
                                                <a href="/products/food" className="text-[#1b3b4d] p-4 hover:bg-[#1b3b4d] hover:text-white transition-colors border-b border-gray-100">food</a>
                                                <a href="/products/accessories" className="text-[#1b3b4d] p-4 hover:bg-[#1b3b4d] hover:text-white transition-colors">accessories</a>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/appointments" className="hover:text-[#68adb6] transition-colors">appointment</Link>
                                    <Link href="/blogs" className="hover:text-[#68adb6] transition-colors">blog</Link>
                                    {isadmin === true ? (
                                        <>
                                            <Link href="/admin/add-product" className="text-[#68adb6] hover:text-[#1b3b4d] transition-colors">upload</Link>
                                            <Link href="/admin/analytics" className="text-[#68adb6] hover:text-[#1b3b4d] transition-colors">analytics</Link>
                                        </>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-6">
                                    <NavAuth />
                                    <Link href="/cart" className="relative group hover:-translate-y-0.5 transition-transform text-[#1b3b4d]">
                                        <span className="text-xl">🛒</span>
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#68adb6] rounded-full border-2 border-white"></span>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </header>
                    <main className="flex-grow">
                        {children}
                    </main>
                </body>
            </html>
        </ClerkProvider>
    );
}