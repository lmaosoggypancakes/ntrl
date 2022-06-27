import axios from "axios";
export const API_URL = "https://ntrl-fbla.herokuapp.com"; // "https://fbla-ntrl.herokuapp.com";
export const createPark = async (park) => {
  try {
    return await axios.post(API_URL, park);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const editPark = async (park, id) => {
  try {
    return await axios.put(`${API_URL}/${id}`, park);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getPark = async (id) => {
  try {
    return await axios.get(`${API_URL}/${id}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getParks = async (id) => {
  try {
    return await axios.get(`${API_URL}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};
