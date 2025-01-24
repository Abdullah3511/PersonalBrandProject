import React from 'react';
import Navbar from './Navbar'; 
import aboutUsImage from '../images/aboutus.jpg'

const AboutUs = () => {
  return (
    <>
    <Navbar/>
    <div className="about-us-container">
      <div className="about-us-hero">
        <div className="hero-text">
          <h1>Welcome to Our World of Shopping</h1>
          <p>Your one-stop destination for laptops, mobiles, cars, bikes, and more!</p>
        </div>
      </div>

      <div className="about-us-content">
        <h2>Who We Are</h2>
        <p>
          At <span className="brand-name">Kchbhe.com</span>, we believe in making your shopping experience as smooth and enjoyable as possible. Established with the vision of bringing top-quality products to your fingertips, we cater to diverse needs with a wide range of categories.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to redefine online shopping by providing a platform that combines convenience, affordability, and quality. From the latest tech gadgets to high-end vehicles, we strive to be your trusted partner for all your shopping needs.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Wide variety of products across multiple categories</li>
          <li>Exceptional customer service and support</li>
          <li>Competitive pricing and regular deals</li>
          <li>Secure payment options and fast delivery</li>
        </ul>
        <p>
          Thank you for trusting us to be a part of your journey. Your satisfaction is our priority, and we look forward to serving you with the best.
        </p>
      </div>

      <div className="about-us-image">
        <img src={aboutUsImage} alt="About Us" />
      </div>
    </div>
    </>
  );
};

export default AboutUs;
