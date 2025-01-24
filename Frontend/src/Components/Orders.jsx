import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate()

  const token = localStorage.getItem("token")


  useEffect(() => {
    // Check if the user has a role and if it's not 'ADMIN', redirect them to home
    const role = localStorage.getItem("role");
    if (role !== "ADMIN" ) {
      navigate("/home");  // Redirect to home if the role is not ADMIN
    }
  }, [navigate]);

  // Fetch orders from the backend
  useEffect(() => {
    fetch(`http://localhost:8080/allrecords`, {
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
        console.log("Fetched Orders: ", data); // Debug: Check if fetched data is correct
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in fetching products:", error.message);
        setLoading(false);
      });
  }, []);

  // Handle the delete (completion) of an order with confirmation
  const handleComplete = (orderId) => {
    // Ask for confirmation
    const isConfirmed = window.confirm("Are you sure you want to complete and delete this order?");

    if (isConfirmed) {
      console.log("Deleting Order ID:", orderId);

      // Send DELETE request to backend to delete the order
      fetch(`http://localhost:8080/deleteorder/${orderId}`, {
        method: "DELETE",
        headers: {
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // On successful deletion, remove the order from the state
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
            console.log(`Order ${orderId} deleted successfully`);
          } else {
            console.error("Failed to delete order:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error deleting order:", error.message);
        });
    } else {
      console.log("Order deletion was canceled.");
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="orders-container">
      <h1>Orders Data</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-name">{order.userName}</span>
                <span className="order-status">{order.status || 'Incompleted'}</span>
              </div>
              <div className="order-details">
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                <p><strong>Address:</strong> {order.userAddress}</p>
                <p><strong>Total Price:</strong> {order.totalPrice}</p>
                <p><strong>Total Quantity:</strong> {order.totalQuantity}</p>
                <div className="product-list">
                  {order.products.map((product, index) => (
                    <div key={product.id || index} className="product-item">
                      <img src={`data:image/png;base64,${product.imageFile}`} alt="product" />
                      <div className="product-info">
                        <p><strong>{product.name}</strong></p>
                        <p>{product.description}</p>
                        <p>Price: {product.price}</p>
                        <p>Category: {product.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="complete-btn"
                onClick={() => handleComplete(order.id)}  // Trigger confirmation and delete
              >
                Complete Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
  
}

export default Orders;
