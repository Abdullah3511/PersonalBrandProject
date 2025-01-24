import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

function InputForm() {
  const [details, setDetails] = useState({
    description: "",
    price: "",
    quantity:"",
    category: "",
    image: null, // Holds the new image file
    imagePreview: "", // Holds the preview image (base64)
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has a role and if it's not 'ADMIN', redirect them to home
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/home");  // Redirect to home if the role is not ADMIN
    }
  }, [navigate]);

  function handlerMethod(event) {
    setDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function handleImage(event) {
    const file = event.target.files[0];
    setDetails((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file), // Generate a preview of the selected image
    }));
  }

  function submitDetails() {
    const token = localStorage.getItem("token")
    const formData = new FormData();
    formData.append("des", details.description);
    formData.append("price", details.price);
    formData.append("category", details.category);
    formData.append("quantity", details.quantity);
    if (details.image) {
      formData.append("image", details.image); // Append the new image file
    }

    // console.log("FormData contents:");
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    fetch("http://localhost:8080/getdetails", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.ok) {
          // alert("Product added successfully");
          // navigate("/home");
          console.log(" added")
        }
      })
      .catch((error) => {
        console.error("Failed to add product:", error);
        alert("Error while adding product");
      });
  }

  return (
    <>
     <AdminNavbar/>
      <div className="form-container">
        <h1>Add Product</h1>
        <form action="/home">
          <textarea
            name="description"
            placeholder="Description of product"
            onChange={handlerMethod}
            className="form-input"
            value={details.description}
            required
            maxLength="500"
          />
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            onChange={handlerMethod}
            className="form-input"
            value={details.price}
          />
            <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            onChange={handlerMethod}
            className="form-input"
            value={details.quantity}
          />
          {details.imagePreview && (
            <div className="image-preview">
              <img
                src={details.imagePreview}
                alt="Product preview"
                className="form-image-preview"
              />
            </div>
          )}
          <input
            type="file"
            id="myFile"
            name="image"
            onChange={handleImage}
            className="form-input"
          />
          <select
            name="category"
            onChange={handlerMethod}
            className="form-select"
            value={details.category}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>

          <button type="button" onClick={submitDetails} className="form-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default InputForm;
