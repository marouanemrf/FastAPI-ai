package com.mirror.server.repository;

import com.mirror.server.entity.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UsersRepo extends MongoRepository<Users, String> {
    @Query("{ '$or' : [ { 'email' : ?0 }, { 'nickname' : ?1 } ] }")
    Users findByEmailAndNickname(String email, String nickname);

    @Query("{ 'email' :  ?0 }")
    Users findByEmail(String email);
}
