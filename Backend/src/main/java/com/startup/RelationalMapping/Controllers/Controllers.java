package com.startup.RelationalMapping.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.startup.RelationalMapping.DTO.Order_product_DTO;
import com.startup.RelationalMapping.Entity.*;
import com.startup.RelationalMapping.Repository.*;
import com.startup.RelationalMapping.Service.EmailService;
import com.startup.RelationalMapping.Service.JWTService;
import com.startup.RelationalMapping.Service.Order_Product_Service;
import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController("/")
@CrossOrigin(origins = "http://localhost:5173")
public class Controllers {


    @Autowired
    ProductDetailsRepo productDetailsRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    UsersRepo usersRepo;

    @Autowired
    JWTService jwtService;

    @Autowired
    EmailService emailService;

    private Users FindUserByEmail(String email) {
        Users user = usersRepo.findByemail(email);
        return user;
    }

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    @PostMapping("/getdetails")
    public ResponseEntity InsertDetails(@RequestParam("des") String description,
                                        @RequestParam("name") String name,
                                        @RequestParam("category") String category,
                                        @RequestParam("quantity") String quantity,
                                        @RequestParam("price") Float price,
                                        @RequestParam("image") MultipartFile image) throws IOException {
        try {
            // Log incoming parameters
            System.out.println("Received description: " + description);
            System.out.println("Received category: " + category);
            System.out.println("Received price: " + price);
            System.out.println("Received image: " + (image != null ? image.getOriginalFilename() : "no image"));

            ProductDetails productDetails = new ProductDetails();
            productDetails.setDescription(description);
            productDetails.setPrice(price);
            productDetails.setCategory(category);
            productDetails.setImageFile(image.getBytes());
            productDetails.setQuantity(Integer.parseInt(quantity));
            productDetails.setName(name);

            productDetailsRepo.save(productDetails);

            return ResponseEntity.status(HttpStatus.OK).body("Saved Successfully");
        } catch (Exception e) {
            System.out.println("Error while adding product");
            e.printStackTrace();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Saved Successfully");
    }


    @GetMapping("/getproduct/{id}")
    public ResponseEntity<Optional<ProductDetails>> Getcar(@PathVariable int id) {
        Optional<ProductDetails> car = productDetailsRepo.findById(id);
        if (car != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body(car);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Optional.empty());
    }

    @GetMapping("/getproductcategory/{category}")
    public ResponseEntity<List<ProductDetails>> GetProducts(@PathVariable String category) {
        System.out.println(category);
        List<ProductDetails> listOfProducts = productDetailsRepo.findAllBycategory(category);
        return ResponseEntity.status(HttpStatus.OK).body(listOfProducts);
    }

    @PostMapping("/getupdatedproduct")
    public ResponseEntity<ProductDetails> updateProduct(
            @RequestParam("des") String description,
            @RequestParam("category") String category,
            @RequestParam("price") Float price,
            @RequestParam("image") Object image,
            @RequestParam("id") String id) throws IOException {
        try {
            Optional<ProductDetails> fetchObj = productDetailsRepo.findById(Integer.parseInt(id));


            if (fetchObj.isPresent()) {
                ProductDetails productDetails = fetchObj.get();
                productDetails.setCategory(category);
                productDetails.setPrice(price);
                productDetails.setDescription(description);

                // Handle image as MultipartFile or byte array
                if (image instanceof MultipartFile) {
                    MultipartFile obj = (MultipartFile) image;
                    productDetails.setImageFile(obj.getBytes());
                } else if (image instanceof String) {
                    byte[] imageBytes = java.util.Base64.getDecoder().decode((String) image);
                    productDetails.setImageFile(imageBytes);
                } else {
                    System.out.println("Unsupported image format");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
                }

                productDetailsRepo.save(productDetails);
                return ResponseEntity.status(HttpStatus.OK).body(productDetails);
            }
            System.out.println("Product not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deleteproduct/{id}")
    public ResponseEntity<ProductDetails> DeleteProduct(@PathVariable int id) {
        Optional<ProductDetails> obj = productDetailsRepo.findById(id);
        if (obj.isPresent()) {
            ProductDetails product = obj.get();
            productDetailsRepo.delete(product);
            return ResponseEntity.status(HttpStatus.OK).body(product);
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(null);
    }

    @GetMapping("search/{category}/{description}")
    public ResponseEntity<List<ProductDetails>> getProducts(@PathVariable String category,
                                                            @PathVariable String description) {
        try {
            System.out.println(category);
            System.out.println(description);
            List<ProductDetails> list = productDetailsRepo.findAllByCategoryAndPrice(category, description);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(" in exception class");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
        user.setRole("USER");
        usersRepo.save(user);
        return new ResponseEntity<>(HttpStatus.CREATED); // Return response with user and 201 status code
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Users user) {
        try {
            System.out.println("In login method");
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getUserPassword())
            );

            if (authentication.isAuthenticated()) {
                // Generate the token
                String token = jwtService.generateToken(user.getUsername());

                // Retrieve user role (you can fetch this from the database or authentication object)
                String role = "USER"; // Replace with your logic to get the actual role
                if (authentication.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ADMIN"))) {
                    role = "ADMIN";
                }

                // Prepare the response map
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", role);

                // Return token and role
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            System.out.println("Invalid token...");
        }
        return new ResponseEntity<>("Login failed", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/getallproducts/{pagenumber}/{pagesize}")
    public ResponseEntity<List<ProductDetails>> GetAllCars(@RequestHeader("Authorization") String token, @PathVariable int pagenumber, @PathVariable int pagesize) {
        System.out.println("Received token: " + token);
        System.out.println("In get all products method");

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Return 401 if token is missing/invalid
        }

        Pageable pageable = PageRequest.of(pagenumber, pagesize);

        // Token validation logic if needed
        List<ProductDetails> products = productDetailsRepo.findAll(pageable).get().toList();
        return ResponseEntity.ok(products);
    }


    @GetMapping("/users")
    public List<Users> getAllUsers() {
        return usersRepo.findAll();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        System.out.println(" send otp");
        String otp = emailService.sendOtp(email);
        // Save the OTP in your database or cache for verification
        // For now, return the OTP (only for testing)
        try {
            Users user = this.FindUserByEmail(email);
            if (user == null) {
                throw new RuntimeException();
            }
            System.out.println(" Found");
            return ResponseEntity.ok("otp is " + otp + "\n " + "user is " + user.getUserName() + " and his email is " + user.getEmail());
        } catch (Exception e) {
            System.out.println(" user not found..");
        }

        return ResponseEntity.notFound().build();
    }


    @PostMapping("/update-password")
    public ResponseEntity<?> UpdatePassword(@RequestParam("email") String email,
                                            @RequestParam("password") String password) {
        System.out.println(" here in method..");
        try {
            Users user = this.FindUserByEmail(email);
            if (user == null) {
                throw new RuntimeException();
            }
            user.setUserPassword(bCryptPasswordEncoder.encode(password));
            usersRepo.save(user);
            return ResponseEntity.ok("updated successfully...");
        } catch (Exception e) {
            System.out.println(" user is not found...");
        }

        return ResponseEntity.notFound().build();

    }

   // For accessing the product details

    @Autowired
    private OrderDataRepository orderDataRepository;

//    @Transactional
@PostMapping("/cartproducts")
public ResponseEntity<?> Addproduct(@RequestBody OrderData orderData) {
    System.out.println(orderData);
    System.out.println("In cart method");

    try {
        // Ensure that productDetails are persisted (either by loading or saving them)
        for (ProductDetails product : orderData.getProductDetails()) {
            // Fetch existing product from the database to ensure it's managed
            ProductDetails existingProduct = productDetailsRepo.findById(product.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + product.getId()));

            // Check if sufficient quantity is available
            if (existingProduct.getQuantity() < product.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + existingProduct.getDescription());
            }

            // Reduce the quantity of the product in stock
            existingProduct.setQuantity(existingProduct.getQuantity() - product.getQuantity());

            // Save the updated product
            productDetailsRepo.save(existingProduct);

            // You don't need to save the product here since it's already managed by the entity manager
        }

        // Save the order (with the product details)
        OrderData savedOrder = orderDataRepository.save(orderData);
        System.out.println("Order details added successfully...");

        return new ResponseEntity<>(savedOrder, HttpStatus.OK);
    } catch (Exception e) {
        System.out.println("Error while adding order: " + e.getMessage());
        return ResponseEntity.badRequest().body("Failed to add order: " + e.getMessage());
    }
}

@Autowired
Order_Product_Service orderProductService;
@GetMapping("/allrecords")
public ResponseEntity<?> getAllOrders(){
    try {
        List<Order_product_DTO> lisOfOrders =  orderProductService.Orders();
        return ResponseEntity.ok(lisOfOrders);
    }
    catch (Exception e){
        System.out.println(" error while fetching orders");
    }

    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
}

@DeleteMapping("/deleteorder/{id}")
public ResponseEntity<?> DeleteOrder(@PathVariable int id){
    try {
        orderDataRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    catch (Exception e){
        System.out.println(" not deleted");
    }

    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

}



}

