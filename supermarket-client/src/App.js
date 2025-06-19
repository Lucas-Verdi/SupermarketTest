import React from "react";
import OrderForm from "./components/OrderForm/OrderForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start", padding: 32 }}>
      <div style={{ flex: 1 }}>
        <OrderForm />
        <ToastContainer/>
      </div>
    </div>
  );
}