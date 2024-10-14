import { useEffect, useState } from "react";

type TSupportedCode = [string, string];

interface ICurrencyListResponse {
  result: string;
  supported_codes: TSupportedCode[];
}

interface IConvertResponse {
  result: string;
  conversion_result: number;
}

function App() {
  const isDevelopment = import.meta.env.MODE === "development";

  const apiUrl = isDevelopment
    ? import.meta.env.VITE_API_URL
    : "https://currency-converter-proxy.vercel.app/proxy/api";
  const apiKey = isDevelopment ? import.meta.env.VITE_API_KEY : null;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<TSupportedCode[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    const url = isDevelopment ? `${apiUrl}/${apiKey}/codes` : `${apiUrl}/codes`;

    const fetchCurrencies = async () => {
      try {
        const response = await fetch(url);
        const data: ICurrencyListResponse = await response.json();

        if (data.result === "success") {
          setCurrencies(data.supported_codes);
        } else {
          throw new Error("Error fetching currency data");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [apiKey, apiUrl, isDevelopment]);

  const convertCurrency = async () => {
    setLoading(true);
    const url = isDevelopment
      ? `${apiUrl}/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`
      : `${apiUrl}/pair?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

    try {
      const response = await fetch(url);
      const data: IConvertResponse = await response.json();

      if (data.result === "success") {
        setConvertedAmount(data.conversion_result);
      } else {
        throw new Error("Error fetching conversion data");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount, apiKey, apiUrl, isDevelopment]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Currency Converter</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>

      <div>
        <label>From: </label>
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>To: </label>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>
          {`${amount} ${fromCurrency} = `}
          {loading ? `Loading... ${toCurrency}` : `${convertedAmount.toFixed(2)} ${toCurrency}`}
        </h3>
      </div>
    </div>
  );
}

export default App;
