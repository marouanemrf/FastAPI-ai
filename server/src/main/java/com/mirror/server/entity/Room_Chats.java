package com.mirror.server.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "Room_Chats")
@JsonPropertyOrder({
        "id",
        "name",
        "avatar",
        "user",
        "creationdate",
        "isarchive",
        "isdelete"
})
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Room_Chats {
    @Id
    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("avatar")
    private String avatar;

    @DBRef
    @JsonProperty("user")
    private Users user;

    @JsonProperty("creationdate")
    private Date creationdate;

    @JsonProperty("isarchive")
    private boolean isarchive = false;

    @JsonProperty("isdelete")
    private boolean isdelete = false;
}
