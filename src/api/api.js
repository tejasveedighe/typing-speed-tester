import axios from "axios";

export const getParagraphs = async () => {
  const data = await axios.get("https://random-word-api.herokuapp.com/all");
  return data;
};
