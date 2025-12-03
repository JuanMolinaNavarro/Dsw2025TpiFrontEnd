import React, { useState } from 'react';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../helpers/cartHelpers';
import '../../../templates/elements.css';

const CartItem = ({ item, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Calcular subtotal
  const subtotal = (item.price * item.quantity).toFixed(2);

  // Incrementar cantidad
  const handleIncrement = () => {
    setIsUpdating(true);
    const result = incrementQuantity(item.id);
    
    if (result.success && onUpdate) {
      onUpdate(result.cart);
    }
    
    setIsUpdating(false);
  };

  // Decrementar cantidad
  const handleDecrement = () => {
    setIsUpdating(true);
    const result = decrementQuantity(item.id);
    
    if (result.success && onUpdate) {
      onUpdate(result.cart);
    }
    
    setIsUpdating(false);
  };

  // Eliminar producto del carrito
  const handleRemove = () => {
    if (window.confirm('¿Deseas eliminar este producto del carrito?')) {
      setIsUpdating(true);
      const result = removeFromCart(item.id);
      
      if (result.success && onUpdate) {
        onUpdate(result.cart);
      }
      
      setIsUpdating(false);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-header">
        <h3 className="cart-item-name">{item.name || 'Nombre de producto'}</h3>
      </div>

      <div className="cart-item-details">
        <p className="cart-item-info">
          Cantidad de productos: <span className="cart-item-value">#{item.quantity}</span>
        </p>
        <p className="cart-item-info">
          Sub Total: <span className="cart-item-value">${subtotal}</span>
        </p>
      </div>

      <div className="cart-item-controls">
        <button 
          className="cart-quantity-btn"
          onClick={handleDecrement}
          disabled={isUpdating}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        
        <span className="cart-quantity-display">{item.quantity}</span>
        
        <button 
          className="cart-quantity-btn"
          onClick={handleIncrement}
          disabled={isUpdating}
          aria-label="Aumentar cantidad"
        >
          +
        </button>

        <button 
          className="btn-remove-item"
          onClick={handleRemove}
          disabled={isUpdating}
        >
          {isUpdating ? 'Eliminando...' : 'Borrar'}
        </button>
      </div>
    </div>
  );
};

export default CartItem;