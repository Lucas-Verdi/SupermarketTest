import React from "react";
import "./ProductsTable.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductsTable({ products, onAdd }) {
  return (
    <div className="table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>R$ {Number(prod.price).toFixed(2)}</td>
              <td>{prod.qty_stock}</td>
              <td>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => {onAdd(prod); toast.success(`Produto "${prod.name}" adicionado ao carrinho!`);}}
                  disabled={prod.qty_stock <= 0}
                >
                  {prod.qty_stock <= 0 ? "Esgotado" : "Adicionar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
