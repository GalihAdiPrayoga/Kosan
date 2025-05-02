import { API } from "./config";

export const loginUser = async (email, password) => {
  try {
    const response = await API.get("/db.json");
    const users = response.data.users;

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Email atau password salah!");
    }

    if (user.status !== "active") {
      throw new Error("Akun tidak aktif");
    }

    // Log untuk debugging
    console.log("Logged in user:", user);

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
