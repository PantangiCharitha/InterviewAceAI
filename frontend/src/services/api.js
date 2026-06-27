import axios from "axios";

const API = axios.create({
  baseURL: "https://interviewaceai-qi83.onrender.com",
});

export default API;