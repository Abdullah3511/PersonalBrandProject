import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Update() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [productdata, setProductData] = useState(null);
  const [data, setData] = useState({
    category: "",
    price: "",
    description: "",
    imageFile: null,
    imagePreview: "" // Added for image preview
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.data) {
      setProductData(location.state.data);
      setData({
        category: location.state.data.category || "",
        price: location.state.data.price || "",
        description: location.state.data.description || "",
        imageFile: location.state.data.imageFile || null,
        imagePreview: location.state.data.imageFile
          ? `data:image/jpeg;base64,${location.state.data.imageFile}`
          : "", // Show existing image
      });
    }
  }, [location.state]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setData((prevData) => ({
        ...prevData,
        imageFile: file,
        imagePreview: reader.result // Set the base64 preview of the image
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Read the selected file as base64
    }
  };

  function sendDetails() {
    const formData = new FormData();
    formData.append("des", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("id", productdata.id);
    if (data.imageFile) {
      formData.append("image", data.imageFile); // Append the new image file
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/getupdatedproduct", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Product Updated successfully");
          // navigate("/home");
        } else {
          alert("Error while updating product");
        }
      })
      .catch((error) => {
        console.error("Failed to update product:", error);
        alert("Error while updating product");
      });
  }

  if (!productdata) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div className="update-form-container">
        <h1 className="form-title">Submit Your Details</h1>
        <form className="update-form">
          <textarea
            name="description"
            placeholder="Description of product"
            className="form-input description"
            value={data.description}
            onChange={handleInputChange}
            required
            maxLength="500"
          />
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={data.price}
            onChange={handleInputChange}
            className="form-input price"
          />
          
          {/* Display image preview */}
          {data.imagePreview && (
            <div className="image-preview">
              <img
                src={data.imagePreview}
                alt="Product Preview"
                className="image-preview-img"
              />
            </div>
          )}

          <input
            type="file"
            id="myFile"
            name="image"
            onChange={handleFileChange}
            className="form-input image-file"
          />

          <select
            name="category"
            onChange={handleInputChange}
            className="form-select"
            value={data.category}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>

          <button type="button" className="form-button" onClick={sendDetails}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Update;
