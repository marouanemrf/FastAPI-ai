package com.mirror.server.repository;

import com.mirror.server.entity.Psychological_User_Traits;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface Psychological_User_TraitsRepo extends MongoRepository<Psychological_User_Traits, String> {
}
