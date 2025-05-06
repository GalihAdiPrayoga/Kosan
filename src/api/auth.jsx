import { API } from "./config";

export const loginUser = async (identifier, password) => {
  try {
    const response = await API.get("/db.json");
    const users = response.data.users;

    // Log the input for debugging
    console.log("Login attempt:", { identifier, password });

    // Find user with exact match for either email or name
    const user = users.find((u) => {
      // Convert to string to handle case sensitivity properly
      const inputIdentifier = String(identifier).toLowerCase();
      const userEmail = String(u.email).toLowerCase();
      const userName = String(u.name).toLowerCase();

      // Debug log
      console.log("Comparing with:", {
        userEmail,
        userName,
        inputIdentifier,
        matches: {
          email: userEmail === inputIdentifier,
          name: userName === inputIdentifier,
        },
      });

      return (
        (userEmail === inputIdentifier || userName === inputIdentifier) &&
        u.password === password
      );
    });

    if (!user) {
      throw new Error("Email/username atau password salah!");
    }

    if (user.status !== "active") {
      throw new Error("Akun tidak aktif");
    }

    // Validate role-specific conditions
    if (user.role === "pemilik") {
      console.log("Pemilik login detected");
    }

    // Log successful login with more details
    console.log("Login successful:", {
      id: user.id,
      name: user.name,
      role: user.role,
      status: user.status,
      loginMethod: user.email === identifier ? "email" : "username",
    });

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
