package com.mirror.server.controller;

import com.mirror.server.DAO.SignUpRequest;
import com.mirror.server.DAO.UserToken;
import com.mirror.server.DAO.UserUpdate;
import com.mirror.server.config.JwtUtil;
import com.mirror.server.entity.Users;
import com.mirror.server.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/Authentication/SignIn")
    public ResponseEntity<?> SignIn (@RequestParam String Profile, @RequestParam String Password) {
        UserToken user = authenticationService.SignIn(Profile, Password);
        if (user == null) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(authenticationService.SignIn(Profile, Password));
    }

    @PostMapping("/Authentication/SignUp")
    public ResponseEntity<?> SignUp (@RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.ok(authenticationService.SignUp(signUpRequest));
    }

    @PostMapping("/Authentication/SignOut")
    public ResponseEntity<?> SignOut(@RequestHeader("Authorization") String authHeader) {
        boolean result = authenticationService.SignOut(authHeader);
        if (result) {
            return ResponseEntity.ok("Logged out successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Logout failed");
        }
    }

    @PostMapping("/Authentication/VerificationAccount")
    public ResponseEntity<?> Verification (@RequestParam String email) {
        return ResponseEntity.ok(authenticationService.SendingVerificationCode(email));
    }

    @PostMapping("/Authentication/ResetPassword")
    public ResponseEntity<?> ResetPassword(@RequestBody Map<String, String> requestData) {
        String code = requestData.get("code");
        String newPassword = requestData.get("newPassword");

        return ResponseEntity.ok(authenticationService.resetPassword(code, newPassword));
    }

    @PostMapping("/Authentication/ValidationAccountMail")
    public ResponseEntity<?> ValidationAccountMail(@RequestParam String email) {
        return ResponseEntity.ok(authenticationService.ValidationAccountMail(email));
    }

    @PostMapping("/Authentication/ValidationAccount")
    public ResponseEntity<?> ValidationAccount(@RequestParam String code) {
        return ResponseEntity.ok(authenticationService.ValidationAccount(code));
    }

    @PostMapping("/Authentication/CompletingInfo/{id}")
    public ResponseEntity<?> CompletingInfo(@PathVariable String id,
                                            @RequestParam String nickname,
                                            @RequestParam String img) {
        try {
            return ResponseEntity.ok(authenticationService.CompletingInfo(id, img, nickname));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing the data.");
        }
    }

    @PostMapping("/Profile/UpdateRequest/{id_user}")
    public ResponseEntity<?> UpdateRequest(@RequestParam String token, @PathVariable String id_user) {
        if (!jwtUtil.ValidateToken(token)) {
            System.out.println("hna");
            return ResponseEntity.ok("SignIn");
        }
        System.out.println("hna1");

        return ResponseEntity.ok(authenticationService.UpdateRequest(id_user));
    }

    @PostMapping("/Profile/DeleteRequest/{id_user}")
    public ResponseEntity<?> DeleteRequest(@RequestParam String token, @PathVariable String id_user) {
        if (!jwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(authenticationService.DeleteRequest(id_user));
    }

    @PostMapping("/Profile/UpdateProfile")
    public ResponseEntity<?> UpdateProfile(@RequestBody UserUpdate userUpdate) {
        if (!jwtUtil.ValidateToken(userUpdate.getToken())) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(authenticationService.UpdateProfileInfo(
                userUpdate.getPic(),
                userUpdate.getNickname(),
                userUpdate.getFirstname(),
                userUpdate.getLastname(),
                userUpdate.getEmail(),
                userUpdate.getPassword(),
                userUpdate.getCode()
        ));
    }

    @PostMapping("/Profile/DeleteProfile")
    public ResponseEntity<?> DeleteProfile(@RequestParam String token, @RequestParam String code) {
        if (!jwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(authenticationService.DeleteProfileInfo(code));
    }

}
