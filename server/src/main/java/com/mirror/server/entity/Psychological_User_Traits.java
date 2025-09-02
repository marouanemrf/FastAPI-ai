package com.mirror.server.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.annotation.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Psychological_User_Traits")
@JsonPropertyOrder({
        "id",
        "user",
        "sociability",
        "humor",
        "seriousness",
        "emotional",
        "curiosity",
        "authority",
        "spirituality",
        "skepticism",
        "naivety",
        "darkness"
})
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Psychological_User_Traits {
    @Id
    @JsonProperty("id")
    private String id;

    @DBRef
    @JsonProperty("user")
    private Users user;

    @JsonProperty("sociability")
    private String sociability;

    @JsonProperty("humor")
    private String humor;

    @JsonProperty("seriousness")
    private String seriousness;

    @JsonProperty("emotional")
    private String emotional;

    @JsonProperty("curiosity")
    private String curiosity;

    @JsonProperty("authority")
    private String authority;

    @JsonProperty("spirituality")
    private String spirituality;

    @JsonProperty("skepticism")
    private String skepticism;

    @JsonProperty("naivety")
    private String naivety;

    @JsonProperty("darkness")
    private String darkness;
}
