"use client"
import { useState } from "react";
import { register } from "./actions";

export default function Register() {

  const [firstname, setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfrimation] = useState("")
  const [error, setError] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [buttonText, setbuttonText] = useState("Submit")

  function submit() {
    console.log("Hello")
    if (password !== passwordConfirmation) {
      setError("Passwords must match")
      return;
    }
    setDisabled(true)
    setbuttonText("Submitting...")
    console.log(firstname, email, password)
    register(firstname, email, password);
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="container p-8 mx-auto self-center h-4/5 w-2/5 bg-opacity-0 rounded-lg bg-gray-700 drop-shadow-lg">
        <div className="flex flex-col mb-16">
        <h1 className="text-6xl font-bold text-gray-800 text-center drop-shadow-md">Register</h1>
        <h2 className="mt-2 mx-auto">Already have an account? <a href="/login" className="text-red-600 underline">Login</a></h2>
        </div>
          <form className="flex flex-col space-y-8" action={() => submit()}>
            <input name="firstname" type= "text" placeholder="Firstname" value={firstname} onChange={(event) => setFirstname(event.target.value)} className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            <input name="email" type="email" placeholder="Email" value={email}  onChange={(event) => setEmail(event.target.value)} className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            <input name="password" type="password" placeholder="Password" value={password}  onChange={(event) => setPassword(event.target.value)} className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            <input name="passwordConfirmation" type="password" placeholder="Confirm Password" value={passwordConfirmation}  onChange={(event) => setPasswordConfrimation(event.target.value)} className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md" required/>
            <button type="submit" disabled={disabled} className="block bg-green-400 w-2/5 h-16 text-2xl text-gray-800 font-bold rounded-lg drop-shadow-md self-center">{buttonText}</button>
            <h2 className="mt-2 text-red-600 mx-auto">{error}</h2>
          </form>
      </div>
    </div>
  );
}
