import axios from "axios";
import { api } from "./Connection.js";

export const SignInConnection = async (profile, password) => {
  try {
    const response = await axios.post(`${api}/Authentication/SignIn`, null, {
      params: {
        Profile: profile,
        Password: password
      }
    });

    console.log("response: ", response.data);
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      throw new Error("Invalid credentials");
    } else {
      throw new Error("Server error");
    }
  }
};

export const SignUpConnection = async (FirstName, LastName, Email, Password) => {
  try {
    const response = await axios.post(
      `${api}/Authentication/SignUp`,
      {
        FirstName,
        LastName,
        Email,
        Password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (e) {
    console.error("Error SignUp:", e);
    return null;
  }
};

export const VerifyEmailConnection = async (Email) => {
    try {
        const response = await axios.post(`${api}/Authentication/VerificationAccount`, null, 
            { params:{
                email: Email
            }}
        );

        console.log("Response:", response.data);
        return response.data;
    } catch (e) {
        console.error("Error Verification mail:", e)
    }
} 

export const Reset_Password = async (code, newPassword) => {
    try {
        const response = await axios.post(`${api}/Authentication/ResetPassword`, 
            {
                code: code,
                newPassword: newPassword
            }
        );

        console.log("Response:", response.data);
        return response.data;
    } catch (e) {
        console.error("Error resetting password:", e);
    }
};

export const ValidationAccountMail = async (email) => {
  try {
    const response = await axios.post(`${api}/Authentication/ValidationAccountMail`, null,
      {
        params: {
          email: email
        }
      }
    );

    return response.data;
  } catch (e) {
    console.log("Error Validation Account Email:", e);
  }

}

export const ValidationAccount = async (code) => {
  try {
    const response = await axios.post(`${api}/Authentication/ValidationAccount`, null,
      {
        params: {
          code: code
        }
      }
    );

    return response.data;
  } catch (e) {
    console.log("Error Validation Account: ", e);
  }
}

export const CompletingInfo = async (id, img, nickname) => {
  try {
    const formData = new FormData();
    formData.append("img", img); // img is now a file object, not base64
    formData.append("nickname", nickname); 

    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      maxContentLength: 1 * 1024 * 1024 * 1024, // 1 GB max
      maxBodyLength: 1 * 1024 * 1024 * 1024,   // 1 GB max
    };

    const response = await axios.post(`${api}/Authentication/CompletingInfo/${id}`, formData, config);

    return response.data;
  } catch (e) {
    console.log("Error completing Info: ", e);
  }
};

export const logOut = async (token, setUser, setToken, navigate) => {
  try {
    const response = await axios.post(`${api}/Authentication/SignOut`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('user');
    setUser(null); 
    setToken(null);

    navigate("/SignIn");

    console.log("Logged out successfully", response.data);
  } catch (error) {
    console.log("Error in LogOut: ", error);
  }
};

export const updateRequest = async (token, id_user) => {
  try {
    const response = await axios.post(`${api}/Profile/UpdateRequest/${id_user}`, null, {
      params: {token}
    });

    return response.data;
  } catch (e) {
    console.log("Error in update request: " + e);
  }
}

export const DeleteRequest = async (token, id_user) => {
  try {
    const response = await axios.post(`${api}/Profile/DeleteRequest/${id_user}`, null, {
      params: {token}
    });

    return response.data;
  } catch (e) {
    console.log("Error in Delete request: " + e);
  }
}

export const UpdateProfile = async (pic, nickname, firstname, lastname, email, password, code, token) => {
  try {
    const response = await axios.post(`${api}/Profile/UpdateProfile`, {
      code: code,
      token: token,
      firstname: firstname,
      lastname: lastname,
      nickname: nickname,
      email: email,
      password: password,
      pic: pic
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (e) {
    console.log("Error in Updating Profile: " + e);
  }
};


export const DeleteProfile = async (token, code) => {
  try {
    const response = await axios.post(`${api}/Profile/DeleteProfile`, null, {
      params: {
        token: token,
        code: code
      }});

    return response.data;
  } catch (e) {
    console.log("Error in Delete Profile: " + e);
  }
}