package com.startup.RelationalMapping.Entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class OrderData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String userName;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double totalPrice;
    private int totalQuantity;

    // Use CascadeType.MERGE to allow merging existing ProductDetails entities
    @ManyToMany(cascade = CascadeType.MERGE) // Cascade persist or merge
    @JoinTable(
            name = "order_product_mapping",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductDetails> productDetails;

    // Getters and Setters


    public int getId() {
        return id;
    }

//    public void setId(int id) {
//        this.id = id;
//    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserAddress() {
        return userAddress;
    }

    public void setUserAddress(String userAddress) {
        this.userAddress = userAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public List<ProductDetails> getProductDetails() {
        return productDetails;
    }

    public void setProductDetails(List<ProductDetails> productDetails) {
        this.productDetails = productDetails;
    }

    @Override
    public String toString() {
        return "OrderData{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", userAddress='" + userAddress + '\'' +
                ", productDetails=" + productDetails +
                '}';
    }
}
