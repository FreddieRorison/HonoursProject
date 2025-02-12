export default function Register() {
  return (
    <div className="flex h-screen w-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
      <div className="container p-8 mx-auto self-center h-4/5 w-2/5 bg-opacity-0 rounded-lg bg-gray-700 drop-shadow-lg">
        <div className="flex flex-col mb-16">
        <h1 className="text-6xl font-bold text-gray-800 text-center drop-shadow-md">Register</h1>
        <h2 className="mt-2 mx-auto">Already have an account? <a href="/login" className="text-red-600 underline">Login</a></h2>
        </div>
          <form className="flex flex-col space-y-8" action="http://localhost:8080/register" method="POST">
            <input name="firstname" type= "text" placeholder="Firstname" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md"/>
            <input name="email" type="email" placeholder="Email" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md"/>
            <input name="password" type="password" placeholder="Password" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md"/>
            <input name="passwordConfirmation" type="password" placeholder="Confirm Password" className="mx-auto w-4/5 h-12 p-2 rounded drop-shadow-md"/>
            <button type="submit" className="block bg-green-400 w-2/5 h-16 text-2xl text-gray-800 font-bold rounded-lg drop-shadow-md self-center">Submit</button>
          </form>
      </div>
    </div>
  );
}
