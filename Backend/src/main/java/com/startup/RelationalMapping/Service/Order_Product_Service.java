package com.startup.RelationalMapping.Service;

import com.startup.RelationalMapping.DTO.Order_product_DTO;
import com.startup.RelationalMapping.Entity.OrderData;
import com.startup.RelationalMapping.Entity.ProductDetails;
import com.startup.RelationalMapping.Repository.OrderDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Order_Product_Service {

    @Autowired
    OrderDataRepository orderDataRepository;

    public List<Order_product_DTO> Orders() {
        List<OrderData> listOfOrders = orderDataRepository.findAll();
        return listOfOrders.stream()
                .map(this::convert) // Converting each OrderData to DTO
                .collect(Collectors.toList());
    }

    // Convert OrderData to Order_product_DTO
    public Order_product_DTO convert(OrderData orderData) {
        Order_product_DTO orderProductDto = new Order_product_DTO();

        // Map fields from OrderData to DTO
        orderProductDto.setUserName(orderData.getUserName());
        orderProductDto.setId(orderData.getId());
        orderProductDto.setUserAddress(orderData.getUserAddress());
        orderProductDto.setPhoneNumber(orderData.getPhoneNumber());
        orderProductDto.setEmail(orderData.getEmail());
        orderProductDto.setTotalPrice(orderData.getTotalPrice());
        orderProductDto.setTotalQuantity(orderData.getTotalQuantity());

        // Map products
        if (orderData.getProductDetails() != null && !orderData.getProductDetails().isEmpty()) {
            List<ProductDetails> productDetailsDTOs = orderData.getProductDetails().stream()
                    .map(this::convertToProductDetailsDTO)
                    .collect(Collectors.toList());

            orderProductDto.setProducts(productDetailsDTOs);
        }

        return orderProductDto;
    }

    // Convert ProductDetails to ProductDetailsDTO
    public ProductDetails convertToProductDetailsDTO(ProductDetails product) {
        ProductDetails productDetailsDTO = new ProductDetails();
        productDetailsDTO.setDescription(product.getDescription());
        productDetailsDTO.setCategory(product.getCategory());
        productDetailsDTO.setPrice(product.getPrice());
        productDetailsDTO.setImageFile(product.getImageFile());

        return productDetailsDTO;
    }
}
