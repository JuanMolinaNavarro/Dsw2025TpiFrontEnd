// modules/customer/components/CartSummary.jsx
import React from 'react';
import { getTotalItems, getTotalPrice } from '../helpers/cartHelpers';
import '../../../templates/elements.css';

const CartSummary = ({ cart, onFinalizePurchase, isProcessing = false }) => {
  // Calcular totales
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Verificar si el carrito está vacío
  const isEmpty = !cart || cart.length === 0;

  return (
    <aside className="cart-summary">
      <h3 className="cart-summary-title">Detalle de pedido</h3>

      <div className="cart-summary-content">
        <p className="cart-summary-info">
          Cantidad de en total: <span className="cart-summary-value">#{totalItems}</span>
        </p>

        <p className="cart-summary-total">
          Total a pagar: <span className="cart-summary-price">${totalPrice.toFixed(2)}</span>
        </p>
      </div>

      <button 
        className="btn-finalize-purchase"
        onClick={onFinalizePurchase}
        disabled={isEmpty || isProcessing}
      >
        {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
      </button>

      {isEmpty && (
        <p className="cart-summary-empty-message">
          Tu carrito está vacío
        </p>
      )}
    </aside>
  );
};

export default CartSummary;