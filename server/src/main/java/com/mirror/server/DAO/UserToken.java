package com.mirror.server.DAO;

import com.mirror.server.entity.Users;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserToken {
    private String token;
    private Users user;

    public UserToken(String token, Users user) {
        this.token = token;
        this.user = user;
    }
}
