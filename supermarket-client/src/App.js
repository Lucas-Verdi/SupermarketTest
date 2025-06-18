import React from "react";
import OrderForm from "./components/OrderForm/OrderForm";
import StockList from "./components/StockList/StockList";

export default function App() {
  return (
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start", padding: 32 }}>
      <div style={{ flex: 1 }}>
        <OrderForm />
      </div>
      <div style={{ flex: 1 }}>
        <StockList />
      </div>
    </div>
  );
}