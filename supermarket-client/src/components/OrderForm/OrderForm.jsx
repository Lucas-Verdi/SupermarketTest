import React, { useState, useEffect } from "react";
import ProductsTable from "../ProductsTable/ProductsTable.jsx";
import TotalPrice from "./TotalPrice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8000";

export default function OrderForm() {
  // Componente principal do formulário de pedidos

  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [alert, setAlert] = useState(null);

  // Função para buscar a lista de produtos do backend
  const fetchProducts = () => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => toast.error("Erro ao buscar produtos!"));
  };

  useEffect(() => {
    // Atualiza a lista de produtos ao montar o componente
    fetchProducts();
  }, []);

  // Adiciona um produto ao carrinho ou incrementa a quantidade se já existir
  const handleAddToCart = (prod) => {
    setAlert(null);
    setOrderItems((prev) => {
      const found = prev.find((item) => String(item.id) === String(prod.id));
      if (found) {
        // Verifica estoque
        if (found.quantity + 1 > prod.qty_stock) {
          setAlert(`Estoque insuficiente para "${prod.name}".`);
          return prev;
        }
        return prev.map((item) =>
          String(item.id) === String(prod.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: prod.id, quantity: 1 }];
    });
  };

  // Remove um item do carrinho
  const handleRemove = (id) => {
    setOrderItems((items) =>
      items.filter((item) => String(item.id) !== String(id))
    );
  };

  // Altera manualmente a quantidade de um item no carrinho
  const handleQuantityChange = (id, val) => {
    const prod = products.find((p) => String(p.id) === String(id));
    if (!prod) return;
    if (val < 1) return;
    if (val > prod.qty_stock) {
      setAlert(`Estoque insuficiente para "${prod.name}".`);
      return;
    }
    setOrderItems((items) =>
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: val } : item
      )
    );
    setAlert(null);
  };

  // Envia o pedido para o backend após validações
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !deliveryDate || orderItems.length === 0) {
      setAlert("Preencha todos os campos e adicione pelo menos um produto.");
      return;
    }
    for (let item of orderItems) {
      const prod = products.find((p) => String(p.id) === String(item.id));
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

    let customerId;
    try {
      const customerRes = await fetch(`${API_URL}/customers/find-or-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customerName }),
      });
      if (!customerRes.ok) throw new Error("Erro ao buscar/criar cliente");
      const customer = await customerRes.json();
      customerId = customer.id;
    } catch {
      toast.error("Erro ao buscar/criar cliente.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          delivery_date: deliveryDate,
          products: orderItems.map(({ id, quantity }) => ({
            id,
            qty: quantity,
          })),
        }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        setAlert(error || "Erro ao salvar pedido.");
        return;
      }
      toast.success(`Pedido salvo com sucesso!`);
      setCustomerName("");
      setDeliveryDate("");
      setOrderItems([]);
      fetchProducts();
    } catch {
      toast.error("Erro na comunicação com o servidor.");
    }
  };

  // Fecha o alerta exibido na tela
  const handleAlertClose = () => setAlert(null);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        borderRadius: 20,
        background: "rgba(255,255,255,0.88)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Novo Pedido</h2>
      {alert && (
        <div
          style={{
            background: "#ffe6e6",
            padding: 8,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          {alert}{" "}
          <button type="button" onClick={handleAlertClose}>
            X
          </button>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <label>Nome do Cliente:</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          style={{
            marginLeft: 8,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d0d0d0",
            minWidth: 200,
          }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>Data de entrega:</label>
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
          style={{
            marginLeft: 8,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      {/* Carrinho */}
      <div style={{ marginTop: 32 }}>
        <h4 style={{ marginBottom: 8 }}>Carrinho</h4>
        {orderItems.length === 0 && (
          <div style={{ color: "#666" }}>Nenhum produto adicionado.</div>
        )}
        {orderItems.map((item, idx) => {
          const prod = products.find((p) => String(p.id) === String(item.id));
          if (!prod) return null;
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 10,
                background: "#f8fafc",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <span style={{ minWidth: 160 }}>{prod.name}</span>
              <span style={{ minWidth: 70 }}>
                R$ {Number(prod.price).toFixed(2)}
              </span>
              <input
                type="number"
                min={1}
                max={prod.qty_stock}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.id, Number(e.target.value))
                }
                style={{
                  width: 60,
                  padding: 6,
                  borderRadius: 6,
                  border: "1px solid #d0d0d0",
                }}
              />
              <span style={{ color: "#8c8c8c" }}>
                estoque: {prod.qty_stock}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleRemove(item.id);
                  toast.warning(`Produto "${prod.name}" removido!`);
                }}
                style={{
                  marginLeft: 12,
                  background: "#f66",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>

      <TotalPrice items={orderItems} products={products} />
      <button
        type="submit"
        style={{
          marginTop: 28,
          fontWeight: 700,
          background: "linear-gradient(90deg,#69e8f7 0%,#a6c1ee 100%)",
          border: "none",
          color: "#263238",
          borderRadius: 10,
          padding: "14px 30px",
          fontSize: 17,
          cursor: "pointer",
          boxShadow: "0 2px 12px rgba(166,193,238,0.15)",
        }}
      >
        Salvar Pedido
      </button>

      {/* Tabela de Produtos */}
      <ProductsTable products={products} onAdd={handleAddToCart} />
    </form>
  );
}
