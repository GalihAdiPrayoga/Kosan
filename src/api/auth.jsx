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

    // Validate role-specific conditions
    if (user.role === "pemilik") {
      // Add any pemilik-specific validation here if needed
      console.log("Pemilik login detected");
    }

    // Log successful login
    console.log("Login successful:", {
      id: user.id,
      name: user.name,
      role: user.role,
      status: user.status,
    });

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
