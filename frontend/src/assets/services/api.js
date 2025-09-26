const API_URL = ""; // empty for now, porxying in vite.connfig.js

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