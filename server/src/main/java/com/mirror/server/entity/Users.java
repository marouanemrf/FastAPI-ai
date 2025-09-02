package com.mirror.server.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "users")
@JsonPropertyOrder({
        "id",
        "styles",
        "datetime",
        "firstname",
        "lastname",
        "nickname",
        "pic",
        "email",
        "password",
        "isverified",
        "iscompleted"
})
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Users {

    @Id
    @JsonProperty("id")
    private String id;

    @DBRef
    @JsonProperty("styles")
    private List<Styles> styles;

    @JsonProperty("datetime")
    private Date datetime;

    @JsonProperty("firstname")
    private String firstname;

    @JsonProperty("lastname")
    private String lastname;

    @JsonProperty("nickname")
    private String nickname;

    @JsonProperty("pic")
    private String pic;

    @JsonProperty("email")
    private String email;

    @JsonProperty("password")
    private String password;

    @JsonProperty("isverified")
    private boolean isverified = false;

    @JsonProperty("iscompleted")
    private boolean iscompleted = false;
}
