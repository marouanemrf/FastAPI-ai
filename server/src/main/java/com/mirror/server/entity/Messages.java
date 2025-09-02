package com.mirror.server.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.annotation.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "Messages")
@JsonPropertyOrder({
        "id",
        "user",
        "room",
        "sender",
        "receiver",
        "timedate"
})
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Messages {
    @Id
    @JsonProperty("id")
    private String id;

    @DBRef
    @JsonProperty("user")
    private Users user;

    @DBRef
    @JsonProperty("room")
    private Room_Chats room;

    @JsonProperty("sender")
    private String sender;

    @JsonProperty("receiver")
    private String receiver;

    @JsonProperty("timedate")
    private Date timedate;
}
