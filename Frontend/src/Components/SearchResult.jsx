import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
// import CatogeyData from "./CatoeryData";

function SearchResult(){

  let [searchdata,setsearchdata ] = useState([])
  let navigate = useNavigate()

  const loc = useLocation();
  const search = loc.state.value
  console.log(search)

  const role = localStorage.getItem("role")

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    console.log("Token being sent:", token);

    fetch(`http://localhost:8080/search/${search}/${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(response)
          return response.json();
        } else {
          throw new Error("Failed to fetch data, status: " + response.status);
        }
      })
      .then((data) => {
        console.log("Fetched data: ", data); // Log the raw data
        setsearchdata(data);
      })
      .catch((error) => {
        console.error("Error in fetching products:", error.message);
        navigate('/login')
      });
  }, [search]);

  console.log(role)
 
  return (
    <>
      {role === "ADMIN" ? <AdminNavbar /> : <Navbar />}
      <div className="search-container-wrapper">
        <div className="searchcontainer">
          {/* Optional heading or description */}
          <h2>Search Results</h2>
        </div>
        <div className="employee-grid">
          {searchdata.map((data, index) => (
            <div
              key={index}
              className="employee-card"
              onClick={() => navigate(`/singleproduct/${data.id}`)}
            >
              <img
                src={`data:${data.imageType};base64,${data.imageFile}`}
                alt={data.name}
                className="employee-image"
              />
              <p>{data.description}</p>
              <h3>Price: {data.price} $</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );

}

export default SearchResult