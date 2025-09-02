package com.mirror.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.annotation.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "DataHelper")
@JsonPropertyOrder({
        "id",
        "style",
        "language",
        "sender",
        "receiver",
        "word",
        "sentence"
})
public class DataHelper {
    @Id
    @JsonProperty("id")
    private String id;

    @JsonProperty("style")
    private String style;

    @JsonProperty("language")
    private String language;

    @JsonProperty("sender")
    private String sender;

    @JsonProperty("receiver")
    private String receiver;

    @JsonProperty("word")
    private List<String> word;

    @JsonProperty("sentence")
    private List<String> sentence;
}
