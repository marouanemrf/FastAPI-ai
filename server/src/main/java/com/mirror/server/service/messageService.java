package com.mirror.server.service;

import com.mirror.server.entity.Messages;
import com.mirror.server.entity.Room_Chats;
import com.mirror.server.entity.Users;
import com.mirror.server.repository.MessagesRepo;
import com.mirror.server.repository.Room_ChatsRepo;
import com.mirror.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class messageService {

    @Autowired
    private MessagesRepo msgRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private Room_ChatsRepo roomChatsRepo;

    public List<Messages> getMessages(String IdUser, String IdRoom) {
        System.out.println(IdUser + " " + IdRoom);
        return msgRepo.findByIsUserIdAndRoomId(IdUser, IdRoom);
    }

    public boolean saveMessage(String id_user, String id_room, String sender, String receiver, Date timedate) {
        Users UserIsExist = usersRepo.findById(id_user).get();
        Room_Chats roomChatsIsExist = roomChatsRepo.findById(id_room).get();

        if (UserIsExist == null || roomChatsIsExist == null) {
            return false;
        }

        Messages new_message = new Messages();
        new_message.setUser(UserIsExist);
        new_message.setRoom(roomChatsIsExist);
        new_message.setSender(sender);
        new_message.setReceiver(receiver);
        new_message.setTimedate(timedate);
        msgRepo.save(new_message);
        return true;
    }
}
