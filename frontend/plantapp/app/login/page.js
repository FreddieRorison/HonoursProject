"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cookies } from "next/headers";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email, password)
      const res = await fetch('http://localhost:8080/login', {
        headers: { 'Content-Type':'application/json'},
        method: 'POST',
        body: JSON.stringify({
          email,password
        })
      });
      if (!res.ok) { setError(res.status, res.statusText); return;}
      const data = await res.cookie();
      cookies().set("jwt", data.jwt)
      router.push('/loginTest')
    } catch(e) {
      setError(e.message)
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
      <div className="container p-8 mx-auto self-center h-4/5 w-2/5 bg-opacity-0 rounded-lg bg-gray-700 drop-shadow-lg">
        <div className="flex flex-col mb-16">
        <h1 className="text-6xl font-bold text-gray-800 text-center drop-shadow-md">Login</h1>
        <h2 className="mt-2 mx-auto">Don't have an account? <a href="/register" className="text-red-600 underline">Register</a></h2>
        </div>
          <form className="flex flex-col space-y-8" onSubmit={formSubmit}>
            <input id="email" type="email" onChange={(event) => setEmail(event.target.value)}  placeholder="Email" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            <div className="flex flex-col">
            <input id="password" type="password" onChange={(event) => setPassword(event.target.value)}  placeholder="Password" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            <a href="#" className="mx-auto mt-1 text-red-600 underline">Forgot Password?</a>
            </div>
            <button type="submit" className="block bg-green-400 w-2/5 h-16 text-2xl text-gray-800 font-bold rounded-lg drop-shadow-md self-center">Submit</button>
            { error && <p className="text-red-1000">{error}</p>}
          </form>
      </div>
    </div>
  );
}
