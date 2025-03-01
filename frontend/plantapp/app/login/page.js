"use client";

import { login } from "./actions";
import { useActionState, useState } from "react";

export default function Login() {
  const [state, action, pending] = useActionState(login)

  return (
    <div className="flex h-screen w-screen">
      <div className="container p-8 mx-auto self-center h-4/5 w-2/5 bg-opacity-0 rounded-lg bg-gray-700 drop-shadow-lg">
        <div className="flex flex-col mb-16">
        <h1 className="text-6xl font-bold text-gray-800 text-center drop-shadow-md">Login</h1>
        <h2 className="mt-2 mx-auto">Don't have an account? <a href="/register" className="text-red-600 underline">Register</a></h2>
        </div>
          <form className="flex flex-col space-y-8" action={action}>
            <input id="email" name="email" type="email"  placeholder="Email" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            {state?.errors?.email && <p className="text-red-600 font-bold">{state.errors.email}</p>}
            <div className="flex flex-col">
            <input id="password" name="password" type="password"  placeholder="Password" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            {state?.errors?.password && <p className="text-red-600 font-bold">{state.errors.password}</p>}
            </div>
            <button type="submit" disabled={pending} className="block bg-green-400 w-2/5 h-16 text-2xl text-gray-800 font-bold rounded-lg drop-shadow-md self-center">{pending ? 'Submitting..' : 'Login'}</button>
            {state?.errors?.general && <p className="text-red-600 font-bold">{state.errors.general}</p>}
          </form>
      </div>
    </div>
  );
}
