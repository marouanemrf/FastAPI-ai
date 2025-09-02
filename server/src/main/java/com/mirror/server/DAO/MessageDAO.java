package com.mirror.server.DAO;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class MessageDAO {

    private String id_user;

    private String id_room;

    private String sender;

    private String receiver;

    private Date timedate;

    private String token;
}
