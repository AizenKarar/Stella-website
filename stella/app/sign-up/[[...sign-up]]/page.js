import { SignUp } from "@clerk/nextjs";

export default function Signuppage() {
    return (
        <div className="min-h-screen bg-[#2C2B30] flex items-center justify-center p-10">
            <SignUp />
        </div>
    );
}