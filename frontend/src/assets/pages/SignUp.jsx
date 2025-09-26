const Signup = () => {
    return (
        <div>
            <form action="">
                <h1>Join BuffBuds Today!</h1>
                <input type="text" placeholder="Username" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Sign Up</button>
                <p>Already have an account? <a href="/signin">Sign In</a></p>
            </form>
        </div>
    )
}

export default Signup
