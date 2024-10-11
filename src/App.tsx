import { useEffect, useState } from "react";

interface CurrencyList {
  [code: string]: string;
}

interface ConvertResponse {
  result: number;
}

interface CurrencyListResponse {
  success: boolean;
  currencies: CurrencyList;
}

function App() {
  const isDevelopment = import.meta.env.MODE === "development";

  const apiUrl = isDevelopment
    ? import.meta.env.VITE_API_URL
    : "https://currency-converter-proxy.vercel.app/proxy/api";
  const apiKey = isDevelopment ? import.meta.env.VITE_API_KEY : null;

  const [currencies, setCurrencies] = useState<CurrencyList>({});
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    const url = isDevelopment ? `${apiUrl}/list?access_key=${apiKey}` : `${apiUrl}/list`;

    fetch(url)
      .then((response) => response.json())
      .then((data: CurrencyListResponse) => {
        if (data.success) {
          setCurrencies(data.currencies);
        }
      })
      .catch((error) => console.error("Error fetching currencies:", error));
  }, [apiKey, apiUrl, isDevelopment]);

  const convertCurrency = () => {
    const url = isDevelopment
      ? `${apiUrl}/convert?access_key=${apiKey}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      : `${apiUrl}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

    fetch(url)
      .then((response) => response.json())
      .then((data: ConvertResponse) => {
        setConvertedAmount(data.result);
      });
  };

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount, apiKey, apiUrl, isDevelopment]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Currency Converter</h1>

      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>

      <div>
        <label>From: </label>
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {Object.entries(currencies).map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>To: </label>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {Object.entries(currencies).map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </h3>
      </div>
    </div>
  );
}

export default App;
