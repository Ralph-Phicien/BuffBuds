import "../../App.css"

const Signup = () => {
    return (
        <div>
            <form style={{ backgroundColor: "var(--bg)" }} action="">
                <h1 style={{ fontFamily: "bebas", fontSize: "3rem" }}>
                    Join <span style={{ color: "var(--acc)" }}>BUFF</span>
                    <span style={{ color: "var(--hl)" }}>BUDS</span> Today!
                </h1>


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
