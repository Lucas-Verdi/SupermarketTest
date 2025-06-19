import React from "react";

// Componente que calcula e exibe o valor total do pedido
export default function TotalPrice({ items, products }) {
  const total = items.reduce((sum, item) => {
    const prod = products.find(p => String(p.id) === String(item.id));
    if (!prod) return sum;
    return sum + (prod.price * (item.quantity || 0));
  }, 0);

  return (
    <div>
      <strong>Total do Pedido:</strong> R$ {total.toFixed(2)}
    </div>
  );
}