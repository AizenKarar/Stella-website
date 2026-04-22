"use client";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function NavAuth() {
    const { isSignedIn, isLoaded } = useUser();

    if (isLoaded === false) {
        return <div className="w-8 h-8 rounded-full bg-[#45444A] animate-pulse"></div>;
    }

    return (
        <div className="flex items-center gap-4 border-l border-[#45444A] pl-4 ml-2">
            <a href="/cart" className="text-[#F2C4CE] hover:opacity-70 transition-opacity p-2 border border-[#F2C4CE]/30 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </a>
            {isSignedIn === true ? (
                <UserButton afterSignOutUrl="/" />
            ) : (
                <SignInButton mode="modal">
                    <button className="bg-[#F2C4CE] text-[#2C2B30] px-4 py-2 rounded font-bold 
                    uppercase tracking-wider text-sm hover:opacity-80 transition-opacity">login</button>
                </SignInButton>
            )}
        </div>
    );
}