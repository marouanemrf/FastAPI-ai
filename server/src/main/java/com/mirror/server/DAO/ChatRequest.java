package com.mirror.server.DAO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {
    private String id_room;
    private String message;
    private String token;
}
