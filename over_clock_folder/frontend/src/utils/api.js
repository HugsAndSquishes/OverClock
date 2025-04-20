import Cookies from "js-cookie";

export async function fetchJSON(url, options = {}) {
  const csrftoken = Cookies.get("csrftoken") || "";

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.json();
}
