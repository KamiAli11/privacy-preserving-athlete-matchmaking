"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {useAuth} from "@/lib/AuthContext";
import {toast} from "react-toastify";

export default function AppPage() {

  const router = useRouter();
  const {login} = useAuth();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const loginHandle = async () => {

    try {
      const res = await fetch("/api/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
      });

      if(res.ok){
        const data = await res.json();

        login(data?.token, data?.user)

        toast.success('Login Successfully');

       return router.push("/dashboard");
      }

      const error = await res.json();

      console.log(error);

      toast.error(error?.message);


    }catch (e) {
      console.log('server error', e);
      toast.error("Something went wrong!");
    }

  };

  return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-6">
            Login
          </h1>

          <div className="space-y-4">

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
                onClick={loginHandle}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              Login
            </button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?
              <span
                  className="text-blue-600 ml-1 cursor-pointer"
                  onClick={()=>router.push("/register")}
              >
                            Register
                        </span>
            </p>

          </div>

        </div>

      </div>
  );
}