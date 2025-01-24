import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Category from "./Category";
import AdminNavbar from "./AdminNavbar";

function CatogeyData(){
    let [categoryData,setCategoryData] = useState([])
    const {category}  = useParams();
    const navigate = useNavigate();
    
    const role = localStorage.getItem("role")
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }
  
      console.log("Token being sent:", token);
      console.log(category);
      
  
      fetch(`http://localhost:8080/getproductcategory/${category}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch data, status: " + response.status);
          }
        })
        .then((data) => {
          console.log("Fetched data: ", data); // Log the raw data
          setCategoryData(data);
        })
        .catch((error) => {
          console.error("Error in fetching products:", error.message);
          navigate('/login')
        });
    }, [category]);

    return(
        <>
          {
          role === "ADMIN" ? (
            <AdminNavbar/>
          ) : (
            <Navbar/>
          )
        }
        <Category/>
        <div className="employee-grid">
          {categoryData.map((categorydata, index) => (
            <div
              key={index}
              className="employee-card" onClick={()=>{
                navigate(`/singleproduct/${categorydata.id}`)
              }}
            >
              <img
                src={`data:${categorydata.imageType};base64,${categorydata.imageFile}`}
                alt={categorydata.name}
                className="employee-image"
              />
               <p>{categorydata.description}</p>
               <h3>Price : {categorydata.price} $</h3>
            </div>
          ))}
        </div>
        </>
    )
  }


export default CatogeyData