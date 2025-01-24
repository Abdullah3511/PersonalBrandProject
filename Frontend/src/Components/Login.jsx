import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
    let [loginData, setLoginData] = useState({});
    let [errorMessage, setErrorMessage] = useState("");
    let navigate = useNavigate();

    function handleInput(event) {
        setLoginData((prev) => {
            return { ...prev, [event.target.name]: event.target.value };
        });
    }

    function handleFormSubmission(event) {
        event.preventDefault();
        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (response.ok) {
                    setErrorMessage(""); // Clear any error message
                    return response.json(); // Parse the response as JSON
                }
                throw new Error("Invalid credentials");
            })
            .then((data) => {
                const { token, role } = data;
                console.log(data)
                localStorage.setItem("token", token); // Store token in localStorage
                localStorage.setItem("role", role);   // Store role in localStorage
                console.log("Token received:", token);
                console.log("Role received:", role);
                    navigate("/home");
            })
            .catch((error) => {
                console.error("Error during login:", error);
                setErrorMessage("Incorrect username or password");
            });
    }

    return (
        <>
            <form className="container" onSubmit={handleFormSubmission}>
        <input
        name="userName"
        type="text"
        className="input"
        placeholder="Enter Name"
        onChange={handleInput}
        />
        <input
        name="userPassword"
        type="password"
        className="input"
        placeholder="Enter Password"
        onChange={handleInput}
        />
        <button type="submit" className="form-button">
        Submit
        </button>
        <p>
        Don't have an account? <Link to="/">Sign up</Link>
        </p>
        <Link to="/forgetpassword">forget password ?</Link>
        <p>{errorMessage}</p>
        </form>
        </>
    );
}

export default Login;
