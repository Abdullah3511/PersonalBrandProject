package com.startup.RelationalMapping.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    JavaMailSender mailSender;


    public String sendOtp(String toEmail) {

        System.out.println(" now mail sender obj is " + mailSender.toString());
        // Generate a 5-digit OTP
        String otp = String.format("%05d", new Random().nextInt(100000));

        // Create the email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hafizabdullahtayyabg@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp);

        // Send the email
        mailSender.send(message);

        return otp;

    }
}
