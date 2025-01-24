import React from "react";
import icon1 from "../images/icon1.png";
import icon2 from "../images/icon2.png";
import icon3 from "../images/icon3.png";
import icon4 from "../images/icon4.png";
import { useNavigate } from "react-router-dom";

function Category() {
      // Icons and category names array
      const icons = [
        { src: icon1, name: "bike" },
        { src: icon2, name: "Car" },
        { src: icon3, name: "Laptop" },
        { src: icon4, name: "Mobile" }
    ];


    let navigate = useNavigate()

    return (
        <>
            <div className="category" >
                {icons.map((icon, index) => (
                    <div className="category-item" key={index}
                    onClick={()=>{
                        navigate(`/catogeydata/${icon.name}`)
                       }}>
                        <img src={icon.src}  />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Category;
