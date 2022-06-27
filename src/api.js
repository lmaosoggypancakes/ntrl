import axios from "axios";
const API_KEY = localStorage.getItem("__API_KEY");
export const API_URL = "https://fbla-ntrl.herokuapp.com"; // "https://fbla-ntrl.herokuapp.com";
export const createPark = async (park) => {
  try {
    return await axios.post(`${API_URL}?key=${API_KEY}`, park);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const editPark = async (park, id) => {
  try {
    return await axios.put(`${API_URL}/${id}?key=${API_KEY}`, park);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getPark = async (id) => {
  try {
    return await axios.get(`${API_URL}/${id}?key=${API_KEY}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getParks = async (id) => {
  try {
    return await axios.get(`${API_URL}?key=${API_KEY}`);
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
