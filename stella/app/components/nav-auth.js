"use client";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function NavAuth() {
    const { isSignedIn, isLoaded } = useUser();

    if (isLoaded === false) {
        return <div className="w-8 h-8 rounded-full bg-[#45444a] animate-pulse"></div>;
    }

    return (
        <div className="flex items-center gap-4 border-l border-[#45444a] pl-4 ml-2">
            {isSignedIn === true ? (
                <UserButton afterSignOutUrl="/" />
            ) : (
                <SignInButton mode="modal">
                    <button className="bg-[#f2c4ce] text-[#2c2b30] px-4 py-2 rounded font-bold uppercase tracking-wider text-sm hover:opacity-80 transition-opacity">login</button>
                </SignInButton>
            )}
        </div>
    );
}