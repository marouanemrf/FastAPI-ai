import axios from "axios";
import {api} from "./Connection.js";

export const GetRooms = async (id_user, token) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.get(`${api}/RoomChat/GetRooms/${id_user}`, {
            params: { token }
        });
        return response.data;
    } catch (e) { 
        console.error("Error in GetRooms: ", e.message);
        return null;
    }
}

export const CreateRoom = async (id_user, token, name) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.post(`${api}/RoomChat/CreateRoom/${id_user}`, null, {
            params: {
                token: token,
                room: name
            }
        });
        return response.data;
    } catch (e) {
        console.error("Error in Creating Room: ", e.message);
    }
}

export const ArchiveRoom = async (id_user, id_room, token) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.get(`${api}/RoomChat/ArchiveRoom/${id_user}/${id_room}`, {
                params: {token}
        });
        return response.data;
    } catch (e) {
        console.error("Error in Archiving room: ", e.message);
    }
}

export const UnArchiveRoom = async (id_user, id_room, token) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.get(`${api}/RoomChat/UnArchiveRoom/${id_user}/${id_room}`, {
            params: {token}
        });
        return response.data;
    } catch (e) {
        console.error("Error in UnArchiving room: ", e.message);
    }
}

export const GetRoom = async (id_room, token) => {
    try {
        if (!token) {
            throw new Error("Toke is required");          
        }
        const response = await axios.get(`${api}/RoomChat/GetRoom/${id_room}`, {
            params: {token}
        });
        return response.data
    } catch (e) {
        console.error("Error in geting room: ", e.message);
    }
}

export const DeleteRoom = async (id_room, id_user, token) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.get(`${api}/RoomChat/DeleteRoom/${id_user}/${id_room}`, {
            params: {token}
        });
        return response.data;
    } catch (e) {
        console.error("Error in Deleting room: ", e.message);
    }
}

export const UnDeleteRoom = async (id_room, id_user, token) => { // TO Impliments 
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.get(`${api}/RoomChat/UnDeleteRoom/${id_user}/${id_room}`, {
            params: {token}
        });
        return response.data;
    } catch (e) {
        console.error("Error in unDeleting room: ", e.message);
    }
}

export const UpdateRoom = async (id_room, id_user, token, name, avatar) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.post(
            `${api}/RoomChat/UpdateRoom/${id_user}/${id_room}`, 
            {
                token: token,
                name: name,
                avatar: avatar
            }
        );
        return response.data;     
    } catch (e) {
        console.error("Error in updating room: ", e.message);
    }
}

export const GetArchivedRoom = async (id_user, token) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        const response = await axios.get(
            `${api}/RoomChat/GetArchivedRoom/${id_user}`,
            { params: { token } } 
        );
        return response.data;
    } catch (e) {
        console.error("Error in Archive Room: ", e.message);
        return [];
    }
};
