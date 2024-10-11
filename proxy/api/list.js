import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const API_KEY = process.env.API_KEY;

  const apiUrl = `https://api.exchangerate.host/list?access_key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching currencies" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
