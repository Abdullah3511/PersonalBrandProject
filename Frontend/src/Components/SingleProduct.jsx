import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SingleProduct({ cartData, setCartData }) {
  const [singleEmployee, setSingleEmployee] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate(); // To navigate back to the list if needed
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "ADMIN" && role !== "USER") {
      navigate("/login"); // Redirect to login if no valid role is found
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/getproduct/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSingleEmployee(data);
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id, navigate, role]);

  function DeleteProduct() {
    const token = localStorage.getItem("token");
    const userConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (userConfirmed) {
      fetch(`http://localhost:8080/deleteproduct/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          navigate("/admin-panel");
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    } else {
      console.log("Product deletion canceled");
    }
  }

  if (!singleEmployee) {
    return <h2>Loading...</h2>;
  }

  const handleAddToCart = (product) => {
    const useranswer = window.confirm(" are you sure you want to add product in cart?")
    if(useranswer){
      setCartData((prev) => [...prev, product]);
    }
  };

  return (
    <div className="single-product-container">
      <h2 className="product-title">Product Details</h2>
      <div className="product-detail-card">
        <div className="product-detail">
          <img
            src={`data:${singleEmployee.imageType};base64,${singleEmployee.imageFile}`}
            alt={singleEmployee.name}
            className="product-image-detail"
          />
          <div className="product-details">
            <h3>{singleEmployee.name}</h3>
            <p><strong>Description:</strong> {singleEmployee.description}</p>
            <p><strong>Price:</strong> {singleEmployee.price} $</p>

            <div className="product-actions">
              {role === "ADMIN" ? (
                <>
                  <button
                    className="update-btn"
                    onClick={() => {
                      navigate("/updateproduct", { state: { data: singleEmployee } });
                    }}
                  >
                    Update
                  </button>

                  <button className="delete-btn" onClick={DeleteProduct}>
                    Delete
                  </button>
                </>
              ) : role === "USER" ? (
                singleEmployee.quantity !== 0?
                <button className="form-button" onClick={() => handleAddToCart(singleEmployee)}>
                Add to Cart
              </button>
              :
              <button className="form-button" >Out Of Stock</button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
