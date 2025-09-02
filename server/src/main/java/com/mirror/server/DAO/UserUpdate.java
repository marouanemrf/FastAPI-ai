package com.mirror.server.DAO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdate {
    private String Code;
    private String token;
    private String firstname;
    private String lastname;
    private String nickname;
    private String email;
    private String password;
    private String pic;
}
