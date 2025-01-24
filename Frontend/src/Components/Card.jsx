import { useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Card({ cartData, setCartData }) {
    const [userData, setUserData] = useState({
        userName: "",
        userAddress: "",
        phoneNumber: "",
        email: "",
        productDetails: [],
        totalPrice: 0,
        totalQuantity: 0,
    });

    const navigate = useNavigate()

    const deliveryCharges = 120; // Fixed delivery charge

    // Use a flag to track the initialization state of the cart
    const [isInitialized, setIsInitialized] = useState(false);
    const token = localStorage.getItem("token")

    // Effect to initialize the cart with quantities set to 0 and update user data
    useEffect(() => {
        if(!token){
            navigate("/login")
        }
        if (cartData.length === 0 || isInitialized) {
            // If cartData is empty or already initialized, do nothing
            return;
        }

        // Initialize the cart with quantities set to 0 and update userData
        const updatedCartData = cartData.map((item) => ({
            ...item,
            quantity: 0, // Set all quantities to 0 initially
        }));

        const totalPrice = updatedCartData.reduce((sum, item) => sum + item.price * 0, 0);
        const totalQuantity = updatedCartData.reduce((sum) => sum + 0, 0);

        setUserData((prev) => ({
            ...prev,
            productDetails: updatedCartData,
            totalPrice: totalPrice.toFixed(2),
            totalQuantity: totalQuantity,
        }));

        setCartData(updatedCartData); // Set cartData with updated quantities

        setIsInitialized(true); // Mark as initialized to prevent further updates
    }, [cartData, isInitialized, setCartData]);

    // Effect to update the totalPrice and totalQuantity whenever cartData changes
    useEffect(() => {
        const totalPrice = cartData.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);
        const totalQuantity = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);

        // Add the delivery charges to the totalPrice
        const totalPriceWithDelivery = totalPrice + deliveryCharges;

        setUserData((prev) => ({
            ...prev,
            totalPrice: totalPriceWithDelivery.toFixed(2), // Display with delivery charges
            totalQuantity: totalQuantity,
        }));
    }, [cartData]);

    // Handle form input changes
    function handleInput(event) {
        const { name, value } = event.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Remove a product from the cart
    function removeProduct(index) {
        const updatedCart = [...cartData];
        updatedCart.splice(index, 1);
        setCartData(updatedCart);
    }

    // Update product quantity in the cart
    function updateQuantity(index, quantity) {
        if (quantity < 0) return; // Prevent quantity from going below 0
        const updatedCart = [...cartData];
        updatedCart[index].quantity = quantity;
        setCartData(updatedCart); // Trigger re-render with updated quantity
    }

    // Send the form data and cart data to the server
    function sendData(event) {
        event.preventDefault();
        const token = localStorage.getItem("token");

        const cartDataToSend = cartData.map((item) => ({
            description: item.description,
            price: item.price,
            category: item.category,
            imageFile: item.imageFile,
            quantity: item.quantity || 0, // Ensure quantity is always set to 0 if not set
        }));

        fetch(`http://localhost:8080/cartproducts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...userData, cartItems: cartDataToSend }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to send data, status: " + response.status);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Data sent successfully:", data);
            })
            .catch((error) => {
                console.error("Error sending data:", error.message);
            });
    }

    return (
        <div className="card-container">
            <form className="user-form" onSubmit={sendData}>
                <input
                    name="userName"
                    type="text"
                    className="input"
                    placeholder="Enter Name"
                    onChange={handleInput}
                    value={userData.userName}
                />
                <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Enter Email"
                    onChange={handleInput}
                    value={userData.email}
                />
                <input
                    name="phoneNumber"
                    type="text"
                    className="input"
                    placeholder="Enter Phone Number"
                    onChange={handleInput}
                    value={userData.phoneNumber}
                />
                <textarea
                    name="userAddress"
                    className="textarea"
                    placeholder="Enter Complete Address"
                    onChange={handleInput}
                    value={userData.userAddress}
                ></textarea>
                <button type="submit" className="form-button">
                    Submit
                </button>
            </form>

            <div className="cart-section">
                <h2>Shopping Cart</h2>
                {cartData.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <ul className="cart-list">
                        {cartData.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img
                                    src={`data:image/jpeg;base64,${item.imageFile}`}
                                    alt={item.description}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <h3>{item.description}</h3>
                                    <p>Price: ${item.price}</p>
                                    <p>Category: {item.category}</p>
                                    <div className="quantity-section">
                                        <label>Quantity:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.quantity || 0} // Ensure quantity starts at 0
                                            onChange={(e) =>
                                                updateQuantity(index, parseInt(e.target.value) || 0)
                                            }
                                        />
                                    </div>
                                </div>
                                <button
                                    className="remove-button"
                                    onClick={() => removeProduct(index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="billing-section">
                    <p>Delivery Charges: ${deliveryCharges}</p>
                    <p>Total Price: ${userData.totalPrice}</p>
                    <p>Total Quantity: {userData.totalQuantity}</p>
                    <button onClick={()=>{
                    console.log(userData)
                    }}>show Data</button>
                </div>
            </div>
        </div>
    );
}

export default Card;
