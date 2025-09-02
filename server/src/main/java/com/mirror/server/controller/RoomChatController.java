package com.mirror.server.controller;

import com.mirror.server.DAO.RoomChatUpdate;
import com.mirror.server.config.JwtUtil;
import com.mirror.server.service.RoomChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class RoomChatController {

    @Autowired
    private RoomChatService Service;

    @Autowired
    JwtUtil JwtUtil;

    @GetMapping("/RoomChat/GetRoom/{id_room}")
    public ResponseEntity<?> GetRoom(@PathVariable String id_room, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.getRoomChat(id_room));
    }

    @GetMapping("/RoomChat/GetRooms/{id_user}")
    ResponseEntity<?> GetRooms(@PathVariable String id_user, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.getRoomChats(id_user));
    }

    @PostMapping("/RoomChat/CreateRoom/{id_user}")
    ResponseEntity<?> CreateRoom(@PathVariable String id_user, @RequestParam String token, @RequestParam String room) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.createRoomChat(room, id_user));
    }

    @GetMapping("/RoomChat/ArchiveRoom/{id_user}/{id_room}")
    ResponseEntity<?> ArchiveRoom(@PathVariable String id_user, @PathVariable String id_room, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.archiveRoomChat(id_user, id_room));
    }

    @GetMapping("/RoomChat/UnArchiveRoom/{id_user}/{id_room}")
    ResponseEntity<?> UnArchiveRoom(@PathVariable String id_user, @PathVariable String id_room, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.UnArchiveRoomChat(id_user, id_room));
    }

    @GetMapping("/RoomChat/DeleteRoom/{id_user}/{id_room}")
    ResponseEntity<?> DeleteRoom(@PathVariable String id_user, @PathVariable String id_room, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.deleteRoomChat(id_user, id_room));
    }

    @GetMapping("/RoomChat/UnDeleteRoom/{id_user}/{id_room}")
    ResponseEntity<?> UnDeleteRoom(@PathVariable String id_user, @PathVariable String id_room, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.UndeleteRoomChat(id_user, id_room));
    }

    @PostMapping("/RoomChat/UpdateRoom/{id_user}/{id_room}")
    ResponseEntity<?> UpdateRoom(@PathVariable String id_user, @PathVariable String id_room, @RequestBody RoomChatUpdate roomChatUpdate) {
        if (!JwtUtil.ValidateToken(roomChatUpdate.getToken())) {
            return ResponseEntity.ok("SignIn");
        }
        return  ResponseEntity.ok(Service.ModifyRoomChat(id_user, id_room, roomChatUpdate.getName(), roomChatUpdate.getAvatar()));
    }

    @GetMapping("/RoomChat/GetArchivedRoom/{id_user}")
    ResponseEntity<?> GetArchivedRoom(@PathVariable String id_user, @RequestParam String token) {
        if (!JwtUtil.ValidateToken(token)) {
            return ResponseEntity.ok("SignIn");
        }
        return ResponseEntity.ok(Service.getArchivedRoomChats(id_user));
    }
}
