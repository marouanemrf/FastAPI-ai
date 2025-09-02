package com.mirror.server.repository;

import com.mirror.server.entity.DataHelper;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DataHelperRepo extends MongoRepository<DataHelper, String> {
}
