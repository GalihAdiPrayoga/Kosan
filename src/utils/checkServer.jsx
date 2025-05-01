import axios from "axios";

export const checkServer = async () => {
  try {
    await axios.get("http://localhost:3001/kos?_limit=1");
    return true;
  } catch (err) {
    console.error("Server check failed:", err);
    return false;
  }
};
