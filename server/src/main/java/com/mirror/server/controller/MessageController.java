package com.mirror.server.controller;

import com.mirror.server.DAO.ChatRequest;
import com.mirror.server.DAO.ChatResponse;
import com.mirror.server.DAO.MessageDAO;
import com.mirror.server.config.JwtUtil;
import com.mirror.server.entity.Messages;
import com.mirror.server.service.messageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@RestController
public class MessageController {
    @Autowired
    private messageService service;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${AI_API_URL}")
    private String api;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/Message/GetMessages/{id_user}/{id_room}")
    public ResponseEntity<?> getMessages(
            @PathVariable String id_user,
            @PathVariable String id_room,
            @RequestParam String token) {

        if (!jwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }

        List<Messages> messages = service.getMessages(id_user, id_room);

        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.ok("No messages found or invalid user/room");
        }

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/Message/chatbot")
    public ResponseEntity<?> chatbot(@RequestBody ChatRequest request) {
        if (!jwtUtil.ValidateToken(request.getToken())) {
            return ResponseEntity.ok("SignIn");
        }
        return restTemplate.postForEntity(api, request, String.class);
    }

    @PostMapping("/Message/SaveMessage/{id_user}/{id_room}")
    public ResponseEntity<?> saveMessage(
            @PathVariable String id_user,
            @PathVariable String id_room,
            @RequestBody MessageDAO message) {

        if (!jwtUtil.ValidateToken(message.getToken())) {
            return ResponseEntity.ok("SignIn");
        }

        return ResponseEntity.ok(service.saveMessage(
                message.getId_user(),
                message.getId_room(),
                message.getSender(),
                message.getReceiver(),
                message.getTimedate()
        ));
    }


}
