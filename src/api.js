import axios from "axios";
import { ref } from "vue";
const API_KEY = ref(localStorage.getItem("__API_KEY"));

export const API_URL = "https://ntrl-fbla.herokuapp.com"; // "https://ntrl-fbla.herokuapp.com";
export const setApiKey = (key) => {
  API_KEY.value = key;
  localStorage.setItem("__API_KEY", key);
};
export const createPark = async (park) => {
  try {
    return await axios.post(`${API_URL}?key=${API_KEY.value}`, park);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const editPark = async (park, id) => {
  try {
    return await axios.put(`${API_URL}/${id}?key=${API_KEY.value}`, park);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getPark = async (id) => {
  try {
    return await axios.get(`${API_URL}/${id}?key=${API_KEY.value}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getParks = async (id) => {
  try {
    return await axios.get(`${API_URL}?key=${API_KEY.value}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const verifyUser = async (key) => {
  try {
    return await axios.get(`${API_URL}/hello?key=${key}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};
