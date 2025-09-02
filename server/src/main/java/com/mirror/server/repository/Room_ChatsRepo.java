package com.mirror.server.repository;

import com.mirror.server.entity.Room_Chats;
import com.mirror.server.entity.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface Room_ChatsRepo extends MongoRepository<Room_Chats, String> {
    @Query("{ 'user.id' : ?0 }")
    List<Room_Chats> findByUser(String id);

    @Query("{'$and' : [ { 'user.id' : ?0 }, { 'isarchive' : ?1 }, { 'isdelete' : ?2 } ] }")
    List<Room_Chats> findByIsDeleteAndIsArchive(String userId, Boolean isArchive, Boolean isDelete);
}
