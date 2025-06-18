import React, { useState, useEffect } from "react";
import OrderItemsList from "./OrderItemsList";
import TotalPrice from "./TotalPrice";

const API_URL = "http://127.0.0.1:8000";

export default function OrderForm() {
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setAlert("Erro ao buscar produtos!"));
  }, []); // <-- array vazio garante que só roda ao montar

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!customerName || !deliveryDate || orderItems.length === 0) {
      setAlert("Preencha todos os campos e adicione pelo menos um produto.");
      return;
    }
    for (let item of orderItems) {
      const prod = products.find(p => String(p.id) === String(item.id));
      if (!prod) {
        setAlert("Produto inválido selecionado.");
        return;
      }
      if (item.quantity > prod.qty_stock) {
        setAlert(`Estoque insuficiente para "${prod.name}".`);
        return;
      }
      if (item.quantity < 1) {
        setAlert("Quantidade deve ser maior que zero.");
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          delivery_date: deliveryDate,
          products: orderItems.map(({ id, quantity }) => ({
            id,
            qty: quantity
          })),
        }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        setAlert(error || "Erro ao salvar pedido.");
        return;
      }
      setAlert("Pedido salvo com sucesso!");
      setCustomerName("");
      setDeliveryDate("");
      setOrderItems([]);
    } catch {
      setAlert("Erro na comunicação com o servidor.");
    }
  };

  const handleAlertClose = () => setAlert(null);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Novo Pedido</h2>
      {alert && (
        <div style={{ background: "#ffe6e6", padding: 8, marginBottom: 10 }}>
          {alert} <button type="button" onClick={handleAlertClose}>X</button>
        </div>
      )}
      <div>
        <label>Nome do Cliente:</label>
        <input
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Data de entrega:</label>
        <input
          type="date"
          value={deliveryDate}
          onChange={e => setDeliveryDate(e.target.value)}
          required
        />
      </div>
      <OrderItemsList
        products={products}
        items={orderItems}
        setItems={setOrderItems}
        setAlert={setAlert}
      />
      <TotalPrice
        items={orderItems}
        products={products}
      />
      <button type="submit">Salvar Pedido</button>
    </form>
  );
}