import { useState, useEffect } from "react";
import InputForm from "./Components/AddProduct";
import Display from "./Components/Display";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingleProduct from "./Components/SingleProduct";
import CatogeyData from "./Components/CatoeryData";
import Login from "./Components/Login";
import Update from "./Components/Update";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/Contact";
import SearchResult from "./Components/SearchResult";
import Register from "./Components/Register";
import ForgetPassword from "./Components/ForgetPassword";
import Card from "./Components/Card";
import Orders from "./Components/Orders";


function App() {
  const [cartData, setCartData] = useState([])
  const [products, setProducts] = useState([]);
  const [numberOfSelectedItems, setNumberOfSelectedItems] = useState(cartData.length);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Display products={products} setProducts={setProducts}/>} />
          <Route path="/insertProduct" element={<InputForm />} />
          <Route path="/updateproduct" element={<Update />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/singleproduct/:id" element={<SingleProduct cartData={cartData} setCartData={setCartData} />} />
          <Route path="/catogeydata/:category" element={<CatogeyData />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/carditems" element={<Card cartData={cartData} setCartData={setCartData}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
