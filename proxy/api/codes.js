import fetch from "node-fetch";

export default async function handler(req, res) {
  // Установка CORS-заголовков для всех запросов
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Обработка preflight-запросов (OPTIONS)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;

  console.log(`${API_URL}/${API_KEY}/codes`);

  try {
    const response = await fetch(`${API_URL}/${API_KEY}/codes`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching data from API" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
