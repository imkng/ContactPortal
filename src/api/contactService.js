import  axios  from "axios";

const API_URL = "http://localhost:8080/api/v1/contacts";
const AUTH_LOGIN_URL = "http://localhost:8080/api/v1/login";
const AUTH_REGISTER_URL = "http://localhost:8080/api/v1/register";

export async function login(login){
    return axios.post(AUTH_LOGIN_URL, login);
}

export async function register(register){
    return axios.post(AUTH_REGISTER_URL, register);
}

export const getAuthTOken = () => {
    return window.localStorage.getItem("auth_token");
  };
  
  export const setAuthToken = (token) => {
    if (token === null) {
      localStorage.clear();
    } else {
      window.localStorage.setItem("auth_token", token);
      console.log("localSotrage " + window.localStorage.getItem("auth_token"));
    }
  };
  
  export const setId = (id) => {
    window.localStorage.setItem("id", id);
  };
  
  export const getId = () => {
    return window.localStorage.getItem("id");
  };

export async function saveContact(contact){
  const headers = {
    'Authorization': `Bearer ${getAuthTOken()}`, // Replace with your actual header and token
    //'Content-Type': 'application/json', // Add any other headers you need
  };
    return await axios.post(API_URL, contact, {headers});
}
export async function getContacts(page =0, size = 12){
  const headers = {
    'Authorization': `Bearer ${getAuthTOken()}`, // Replace with your actual header and token
    //'Content-Type': 'application/json', // Add any other headers you need
  };
    return await axios.get(`${API_URL}?page=${page}&size=${size}`, {headers});
}
export async function getContact(id){
  const headers = {
    'Authorization': `Bearer ${getAuthTOken()}`
  };
    return await axios.get(`${API_URL}/${id}`, {headers});
}
export async function updateContact(contact){
  const headers = {
    'Authorization': `Bearer ${getAuthTOken()}`
  };
    return await axios.post(API_URL, contact, {headers});
}
export async function updatePhoto(formData){
  const headers = {
    'Authorization': `Bearer ${getAuthTOken()}`
  };
    return await axios.put(`${API_URL}/photo`, formData, {headers});
}
export async function deleteContact(id){
    return await axios.delete(`${API_URL}/${id}`);
}