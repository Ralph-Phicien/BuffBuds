const Signup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white]">
      <form className="bg-[var(--bg)] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 
          className="text-5xl mb-6 font-[bebas] text-center"
        >
          Join <span className="text-[var(--acc)]">Buff</span>
          <span className="text-[var(--hl)]">Buds</span> Today!
        </h1>

        <input 
          type="text" 
          placeholder="Username" 
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />

        <button 
          type="submit" 
          className="w-full bg-[var(--hl)] text-white py-3 rounded-md hover:bg-blue-600 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-[var(--hl)] hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  )
}

export default Signup
