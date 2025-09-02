package com.mirror.server.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Styles")
@JsonPropertyOrder({
        "id",
        "name",
        "desc"
})
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Styles {
    @Id
    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("desc")
    private String shortDescription;

    public Styles(String name, String shortDescription) {
        this.name = name;
        this.shortDescription = shortDescription;
    }
}
