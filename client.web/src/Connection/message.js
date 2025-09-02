import axios from "axios";
import { api } from "./Connection.js";

export const GetMessages = async (id_user, id_room, token) => {
    try {
        const response = await axios.get(`${api}/Message/GetMessages/${id_user}/${id_room}`, {
            params: { token }  
        });

        return response.data;
    } catch (e) {
        console.log("Error in getting messages:", e);
    }
};

export const requestChat = async(id_room, message, token) => {
    try {
        const response = await axios.post(`${api}/Message/chatbot`, {
                id_room: id_room,
                message: message,
                token: token
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
        return response.data;

    } catch (e) {
        console.log("Error in Request Chatbot: ", e);
    }
}

export const SaveMessage = async (id_user, id_room, token, sender, receiver, timedate) => {
    try {
        const response = await axios.post(`${api}/Message/SaveMessage/${id_user}/${id_room}`, {
            id_user: id_user,
            id_room: id_room,
            sender: sender,
            receiver: receiver,
            timedate: timedate,
            token: token
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    } catch (e) {
        console.log("Error in saving message: ", e);
    }
}
