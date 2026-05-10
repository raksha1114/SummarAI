const BASE_URL = "http://127.0.0.1:8000";

export const registerUser = async (userData) => {

  const response = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      full_name: userData.name,
      phone_no: userData.phone,
      password: userData.password,
      confirm_password: userData.password,
    }),
  });

  const data = await response.json();

  console.log("Backend Response:", data);

  if (!response.ok) {

    // Convert FastAPI validation errors into readable text
    let errorMessage = "Registration failed";

    if (Array.isArray(data.detail)) {
      errorMessage = data.detail
        .map((err) => err.msg)
        .join(", ");
    } else if (typeof data.detail === "string") {
      errorMessage = data.detail;
    }

    throw new Error(errorMessage);
  }

  return data;
};

// ==============================
// 🔹 LOGIN API
// ==============================
export const loginUser = async (loginData) => {

  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_no: loginData.phone,
      password: loginData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
   return data;
};