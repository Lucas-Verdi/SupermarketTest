import React from "react";

export default function OrderItemsList({ products, items, setItems, setAlert }) {
  const handleChange = (idx, field, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(updated);
  };

  const handleAdd = () => setItems([...items, { id: "", quantity: 1 }]);
  const handleRemove = (idx) => setItems(items.filter((_, i) => i !== idx));

  return (
    <div>
      <h4>Lista de Compras</h4>
      {items.map((item, idx) => {
        const prod = products.find(p => String(p.id) === String(item.id));
        return (
          <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select
              value={item.id}
              onChange={e => handleChange(idx, "id", e.target.value)}
              required
            >
              <option value="">Selecione o produto</option>
              {products.map(p => {
                const price = Number(p.price);
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} (R${price.toFixed(2)}, estoque: {p.qty_stock})
                  </option>
                );
              })}
            </select>
            <input
              type="number"
              min={1}
              max={prod ? prod.qty_stock : 1}
              value={item.quantity}
              onChange={e => {
                const val = Number(e.target.value);
                if (prod && val > prod.qty_stock) {
                  setAlert(`Estoque insuficiente para "${prod.name}".`);
                } else {
                  setAlert(null);
                  handleChange(idx, "quantity", val);
                }
              }}
              required
            />
            <button type="button" onClick={() => handleRemove(idx)}>
              Remover
            </button>
          </div>
        );
      })}
      <button type="button" onClick={handleAdd}>
        Adicionar Produto
      </button>
    </div>
  );
}