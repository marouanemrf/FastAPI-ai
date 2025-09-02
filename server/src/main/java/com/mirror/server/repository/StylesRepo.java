package com.mirror.server.repository;

import com.mirror.server.entity.Styles;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StylesRepo extends MongoRepository<Styles, String> {
    boolean existsByName(String name);
}
