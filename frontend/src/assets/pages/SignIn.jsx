const Signin = () => {
    return (
        <div>
            <h1>Welcome to BuffBuds!</h1>
            <form action="">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Sign In</button>
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </form>
        </div>
    )
}

export default Signin
