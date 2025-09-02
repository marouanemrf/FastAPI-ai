package com.mirror.server.DAO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {
    @JsonProperty("FirstName")
    private String FirstName;

    @JsonProperty("LastName")
    private String LastName;

    @JsonProperty("Email")
    private String Email;

    @JsonProperty("Password")
    private String Password;
}
