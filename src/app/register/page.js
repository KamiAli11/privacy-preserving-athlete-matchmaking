"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {toast} from "react-toastify";


export default function RegisterPage() {

    const router = useRouter();

    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const register = async () => {

        try {
            const res = await fetch("/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await res.json();

            if(res.ok){
                toast.success("Account created successfully!");
                return router.push("/");
            }

            toast.error(data.message);
        }catch (e) {
            console.log('server error', e);
            toast.error("Something went wrong!");
        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Register
                </h1>

                <div className="space-y-4">

                    <input
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="First Name"
                        onChange={(e)=>setFirstName(e.target.value)}
                    />

                    <input
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Last Name"
                        onChange={(e)=>setLastName(e.target.value)}
                    />

                    <input
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button
                        onClick={register}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer "
                    >
                        Create Account
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?
                        <span
                            className="text-blue-600 ml-1 cursor-pointer"
                            onClick={()=>router.push("/login")}
                        >
                            Login
                        </span>
                    </p>

                </div>

            </div>

        </div>
    );
}