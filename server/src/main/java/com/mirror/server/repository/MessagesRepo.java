package com.mirror.server.repository;

import com.mirror.server.entity.Messages;
import com.mirror.server.entity.Room_Chats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessagesRepo extends MongoRepository<Messages, String> {
    @Query("{'$and' : [ { 'user.id' : ?0 }, { 'room.id' : ?1 } ] }")
    List<Messages> findByIsUserIdAndRoomId(String userId, String roomId);
}
