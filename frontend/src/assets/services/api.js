const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(endpoint, options);
  return res.json();
}