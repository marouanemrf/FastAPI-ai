package com.mirror.server.service;

import com.mirror.server.entity.Room_Chats;
import com.mirror.server.entity.Users;
import com.mirror.server.repository.Room_ChatsRepo;
import com.mirror.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RoomChatService {
    @Autowired
    UsersRepo usersRepo;

    @Autowired
    Room_ChatsRepo roomChatsRepo;

    public Room_Chats createRoomChat(String name, String id) {
        Users isExist = usersRepo.findById(id).get();
        if (isExist == null) { return null; }

        Room_Chats newRoomChat = new Room_Chats();
        newRoomChat.setName(name);
        newRoomChat.setCreationdate(new Date());
        newRoomChat.setUser(isExist);

        roomChatsRepo.save(newRoomChat);
        return newRoomChat;
    }

    public Room_Chats ModifyRoomChat(String id_User, String id_Room, String name, String avatar) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return null; }

        Room_Chats roomChat = roomChatsRepo.findById(id_Room).get();
        if (roomChat == null) { return null; }

        roomChat.setName(name);
        roomChat.setAvatar(avatar);

        roomChatsRepo.save(roomChat);
        return roomChat;
    }

    public boolean deleteRoomChat(String id_User, String id_Room) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return false; }

        Room_Chats roomChat = roomChatsRepo.findById(id_Room).get();
        if (roomChat == null) { return false; }

        roomChat.setIsdelete(true);
        roomChat.setIsarchive(false);
        roomChatsRepo.save(roomChat);
        return true;
    }

    public boolean UndeleteRoomChat(String id_User, String id_Room) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return false; }

        Room_Chats roomChat = roomChatsRepo.findById(id_Room).get();
        if (roomChat == null) { return false; }

        roomChat.setIsdelete(false);
        roomChatsRepo.save(roomChat);
        return true;
    }

    public boolean archiveRoomChat(String id_User, String id_Room) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return false; }

        Room_Chats roomChat = roomChatsRepo.findById(id_Room).get();
        if (roomChat == null) { return false; }

        roomChat.setIsarchive(true);
        roomChat.setIsdelete(false);
        roomChatsRepo.save(roomChat);
        System.out.println("mchate: " + roomChat.getName() + " " + roomChat.isIsarchive());
        return true;
    }

    public boolean UnArchiveRoomChat(String id_User, String id_Room) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return false; }

        Room_Chats roomChat = roomChatsRepo.findById(id_Room).get();
        if (roomChat == null) { return false; }

        roomChat.setIsarchive(false);
        roomChatsRepo.save(roomChat);
        System.out.println("mchate: " + roomChat.getName() + " " + roomChat.isIsarchive());
        return true;
    }

    public Room_Chats getRoomChat(String id_Room) {
        return roomChatsRepo.findById(id_Room).get();
    }

    public List<Room_Chats> getDeletedRoomChats(String id_User) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return null; }

        return roomChatsRepo.findByIsDeleteAndIsArchive(id_User, false, true);
    }

    public List<Room_Chats> getArchivedRoomChats(String id_User) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return null; }

        return roomChatsRepo.findByIsDeleteAndIsArchive(id_User, true, false);
    }

    public List<Room_Chats> getRoomChats(String id_User) {
        Users isExist = usersRepo.findById(id_User).get();
        if (isExist == null) { return null; }

        return roomChatsRepo.findByIsDeleteAndIsArchive(id_User, false, false);
    }

    @Scheduled(cron = "0 0 0 31 * *")
    public void DeleteRoomChatsMonthly() {
        List<Room_Chats> roomChats = roomChatsRepo.findAll();

        for (Room_Chats roomChat : roomChats) {

            if (roomChat.isIsdelete()) {
                roomChatsRepo.delete(roomChat);
            }
        }
    }

}
