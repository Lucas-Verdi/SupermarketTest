import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function StockList() {
  const [stock, setStock] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/products/stock`)
      .then(res => res.json())
      .then(setStock)
      .catch(() => setError("Erro ao carregar estoque!"));
  }, []); // <-- array vazio garante que só roda ao montar

  return (
    <div>
      <h3>Estoque Atual</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {stock.map((item) => (
          <li key={item.name}>
            {item.name} — {item.qty_stock} unidades
          </li>
        ))}
      </ul>
    </div>
  );
}