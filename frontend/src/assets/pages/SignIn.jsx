const Signin = () => {
    return (
        <div>
            <form style={{ backgroundColor: "var(--bg)" }} action="">
                <h1 style={{ fontFamily: "bebas", fontSize: "3rem" }}>
                    Welcome To <span style={{ color: "var(--acc)" }}>BUFF</span>
                    <span style={{ color: "var(--hl)" }}>BUDS</span>.
                </h1>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Sign In</button>
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </form>
        </div>
    )
}

export default Signin
