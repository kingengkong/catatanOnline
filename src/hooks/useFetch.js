import { useState } from "react";

export function useFetch(url) {
  const [loading, setLoading] = useState(false);

  const postData = async (data) => {
    setLoading(true);
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading };
}
