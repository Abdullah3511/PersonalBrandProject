// Display.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "./Category";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

function Display({products, setProducts}) {
  

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    const pagesize = 10;

    fetch(`http://localhost:8080/getallproducts/${pageNumber}/${pagesize}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data, status: " + response.status);
        }
      })
      .then((data) => {
        setProducts(data);
        console.log("data is " ,data)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in fetching products:", error.message);
        setError("Failed to fetch products. Please try again later.");
        navigate("/login");
      });
  }, [pageNumber]);


  return (
    <>
      {role === "ADMIN" ? (
        <AdminNavbar />
      ) : (
        <div>
          <Navbar />
        </div>
      )}
      <Category />
      <div className="employee-grid">
        {products.map((product) => {
          if (!product.description || !product.imageFile || !product.price) {
            console.log("Missing data for product:", product.id);
            return null;
          }

          return (
            <div key={product.id} className="employee-card">
              <img
                src={`data:image/jpeg;base64,${product.imageFile}`}
                alt={product.description || "Product Image"}
                onError={(e) => (e.target.src = "/fallback-image.png")}
                className="employee-image"
              />
              <p>{product.description}</p>
              <p>{product.id}</p>
              <h3>Price: ${product.price}</h3>
              <button onClick={() => navigate(`/singleproduct/${product.id}`)} className="form-button">
                Show Details
              </button>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button className="btn" onClick={() => setPageNumber(pageNumber + 1)}>
          Next
        </button>
        <button className="btn" onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}>
          Previous
        </button>
      </div>
    </>
  );
}

export default Display;
