package com.startup.RelationalMapping.Advise;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MalformedJwtException.class)
//    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public void handleMalformedJwtException(MalformedJwtException e) {
        System.out.println("Not Authorized: Invalid JWT token.");
//        return "Not Authorized: Invalid JWT token."; // You can return a custom message
    }

//    @ExceptionHandler(Exception.class)
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    public String handleException(Exception e) {
//        System.out.println("Error occurred: " + e.getMessage());
//        return "An error occurred. Please try again later.";
//    }
}
