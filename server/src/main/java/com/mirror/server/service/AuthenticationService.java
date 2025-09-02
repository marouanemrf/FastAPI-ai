package com.mirror.server.service;

import com.mirror.server.DAO.SignUpRequest;
import com.mirror.server.DAO.UserToken;
import com.mirror.server.config.JwtUtil;
import com.mirror.server.config.TokenBlacklistService;
import com.mirror.server.entity.Users;
import com.mirror.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class AuthenticationService {
    @Autowired
    private UsersRepo repo;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    private final Map<String, Users> resetTokenStorage = new ConcurrentHashMap<>();

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private SmtpService smtp;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private String capitalize(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    public UserToken SignIn(String profile, String password) {
        System.out.println("Profile: " + profile + " Passwor: " + password);
        Users isExist = repo.findByEmailAndNickname(profile, profile);

        if (isExist == null) {
            return null;
        }

        if (!passwordEncoder.matches(password, isExist.getPassword())) {
            return null;
        }

        String token = jwtUtil.GenerateToken(isExist.getEmail());
        return new UserToken(token, isExist);
    }


    public boolean SignUp(SignUpRequest u) {
        System.out.println("Received sign-up: " + u.getFirstName() + " " + u.getLastName());

        Users isExist = repo.findByEmail(u.getEmail());
        if (isExist != null) return false;

        Users newUser = new Users();
        newUser.setFirstname(u.getFirstName());
        newUser.setLastname(u.getLastName());
        newUser.setEmail(u.getEmail());
        newUser.setDatetime(new Date());
        newUser.setPassword(passwordEncoder.encode(u.getPassword()));

        repo.save(newUser);
        return true;
    }

    public boolean SignOut(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }

        System.out.println("token: " + authHeader);

        String token = authHeader.substring(7);
        tokenBlacklistService.blacklist(token);
        resetTokenStorage.remove(token);
        return true;
    }

    public String SendingVerificationCode(String email) {
        Users isExist = repo.findByEmail(email);
        if (isExist == null) return "None";

        SecureRandom secureRandom = new SecureRandom();
        String Code = String.format("%06d", secureRandom.nextInt(1_000_000));
        resetTokenStorage.put(Code, isExist);

        new Thread(() -> {
            try {
                TimeUnit.MINUTES.sleep(10);
                resetTokenStorage.remove(Code);
            } catch (InterruptedException e) {
                System.out.println("Error in SendingVerificationCode: " + e.getMessage());
            }
        }).start();

        String emailBody = String.format("""
            Hello %s %s, \n \n \n
    
            We received a request to reset the password of your MirrorAI account. \n
            Please use the verification code below to continue: \n \n
    
            🔐 Verification Code: %s \n \n
    
            This code is valid for the next 10 minutes. Please do not share it with anyone. \n
    
            If you did not request a password reset, you can safely ignore this email. \n \n \n
    
            — The MirrorAI Team
            """, capitalize(isExist.getFirstname()), capitalize(isExist.getLastname()), Code);


        smtp.sendEmailToClient(email, "MirrorAI: Password request", emailBody);

        return Code;
    }

    public boolean resetPassword(String Code, String newPassword) {
        Users user = resetTokenStorage.get(Code);

        if (user == null) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        repo.save(user);

        resetTokenStorage.remove(Code);

        return true;
    }

    public String ValidationAccountMail(String email) {
        Users isExist = repo.findByEmail(email);
        if (isExist == null) {
            return "None";
        }

        SecureRandom secureRandom = new SecureRandom();
        String Code = String.format("%06d", secureRandom.nextInt(1_000_000));
        resetTokenStorage.put(Code, isExist);

        new Thread(() -> {
            try {
                TimeUnit.MINUTES.sleep(10);
                resetTokenStorage.remove(Code);
            } catch (InterruptedException e) {
                System.out.println("Error in SendingVerificationCode: " + e.getMessage());
            }
        }).start();

        String emailBody = String.format("""
            Hello %s %s, \n \n \n
    
            You must verify your MirrorAI account. \n
            Please use the verification code below to continue: \n \n
    
            🔐 Verification Code: %s \n \n
    
            This code is valid for the next 10 minutes. Please do not share it with anyone. \n
    
            If you did not have a account in MirrorAI, you can safely ignore this email. \n \n \n
    
            — The MirrorAI Team
            """, capitalize(isExist.getFirstname()), capitalize(isExist.getLastname()), Code);


        smtp.sendEmailToClient(email, "MirrorAI: Account Verification", emailBody);

        return Code;

    }

    public boolean ValidationAccount(String Code) {
        Users user = resetTokenStorage.get(Code);

        if (user == null) {
            return false;
        }

        user.setIsverified(true);
        repo.save(user);

        resetTokenStorage.remove(Code);
        return true;
    }

    public Users CompletingInfo(String Id, String img, String NickName) {
        System.out.println("ID: " + Id);
        Optional<Users> isExist = repo.findById(Id);

        if (isExist.isPresent()) {
            Users user = isExist.get();

            user.setPic(img);
            user.setNickname(NickName);
            user.setIscompleted(true);
            repo.save(user);

            return user;
        }

        return null;
    }

    public String UpdateRequest(String id) {
        System.out.println("ID: " + id);
        Users user = repo.findById(id).get();
        if (user == null) {
            return "None"; // No user found with the provided email
        }

        SecureRandom secureRandom = new SecureRandom();
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        resetTokenStorage.put(code, user);  // Store the verification code and associated user in resetTokenStorage

        // Thread to remove the verification code after 10 minutes (or timeout duration)
        new Thread(() -> {
            try {
                TimeUnit.MINUTES.sleep(10);
                resetTokenStorage.remove(code);
            } catch (InterruptedException e) {
                System.out.println("Error in UpdateRequest: " + e.getMessage());
            }
        }).start();

        String emailBody = String.format("""
        Hello %s %s, \n \n \n

        You requested to update your MirrorAI profile. \n
        Please use the verification code below to continue: \n \n

        🔐 Verification Code: %s \n \n

        This code is valid for the next 10 minutes. Please do not share it with anyone. \n

        If you did not request an update, you can safely ignore this email. \n \n \n

        — The MirrorAI Team
        """, capitalize(user.getFirstname()), capitalize(user.getLastname()), code);

        smtp.sendEmailToClient(user.getEmail(), "MirrorAI: Profile Update Request", emailBody);

        return code; // Return the verification code for the client to enter
    }


    public String DeleteRequest(String id) {
        Users user = repo.findById(id).get();
        if (user == null) {
            return "None"; // No user found with the provided email
        }

        SecureRandom secureRandom = new SecureRandom();
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        resetTokenStorage.put(code, user);  // Store the verification code and associated user in resetTokenStorage

        // Thread to remove the verification code after 10 minutes (or timeout duration)
        new Thread(() -> {
            try {
                TimeUnit.MINUTES.sleep(10);
                resetTokenStorage.remove(code);
            } catch (InterruptedException e) {
                System.out.println("Error in DeleteRequest: " + e.getMessage());
            }
        }).start();

        String emailBody = String.format("""
        Hello %s %s, \n \n \n

        You requested to delete your MirrorAI account. \n
        Please use the verification code below to continue: \n \n

        🔐 Verification Code: %s \n \n

        This code is valid for the next 10 minutes. Please do not share it with anyone. \n

        If you did not request account deletion, you can safely ignore this email. \n \n \n

        — The MirrorAI Team
        """, capitalize(user.getFirstname()), capitalize(user.getLastname()), code);

        smtp.sendEmailToClient(user.getEmail(), "MirrorAI: Account Deletion Request", emailBody);

        return code; // Return the verification code for the client to enter
    }

    public Users UpdateProfileInfo(String pic, String nickName, String firstName, String lastName, String email, String password, String code) {
        System.out.println("Code: " + code);
        Users IsExist = resetTokenStorage.get(code);
        if (IsExist == null) {
            throw new IllegalArgumentException("Invalid or expired code provided.");
        }

        System.out.println("ID: " + IsExist.getId());
        System.out.println("Firstname: " + firstName);

        // Update the user profile fields
        if (password == null || password.isEmpty()) {
            IsExist.setFirstname(firstName);
            IsExist.setLastname(lastName);
            IsExist.setNickname(nickName);
            IsExist.setEmail(email);
            IsExist.setPic(pic);
        } else {
            IsExist.setFirstname(firstName);
            IsExist.setLastname(lastName);
            IsExist.setNickname(nickName);
            IsExist.setEmail(email);
            IsExist.setPic(pic);
            IsExist.setPassword(passwordEncoder.encode(password));
        }

        // Save the updated user
        repo.save(IsExist);
        return IsExist;
    }

    public boolean DeleteProfileInfo(String code) {
        Users IsExist = resetTokenStorage.get(code);
        if (IsExist == null) { return false; }
        repo.delete(IsExist);
        return true;
    }
}
