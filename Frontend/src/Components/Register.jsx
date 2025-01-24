import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
function Register(){
    let [userData,setUserData] = useState({})
    let navigate = useNavigate()

    function handleInput(event){
    setUserData((prev)=>{
    return {...prev,[event.target.name] : event.target.value }
    })
    }

    function handleFormSubmission(event){
        event.preventDefault(); 
        fetch("http://localhost:8080/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Add for JSON body
            body: JSON.stringify(userData),
          })
            .then((response) => {
                if(response.ok){
                navigate("/login")
                }
            })
            .catch((error) => {
              alert("Error while registering user...");
            });
    }
    return(
        <>
        <form  className="container" onSubmit={handleFormSubmission}>
        <input name="userName" type="text" className="input" placeholder="Enter Name" onChange={handleInput}/>
        <input name="email" type="email" className="input" placeholder="Enter Email" onChange={handleInput}/>
        <input name="userPassword" type="password" className="input" placeholder="Enter Password" onChange={handleInput}/>
        <button type="submit" className="form-button" >Submit</button>
        <p>already have an account ? <Link to= "/login">sign in</Link> </p>
        </form>
        
        </>
    )
}

export default Register