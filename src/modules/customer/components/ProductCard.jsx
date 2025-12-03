import React, { useState } from 'react';
import { addToCart } from '../helpers/cartHelpers';
import '../../../templates/elements.css';

const ProductCard = ({ product, onAddSuccess }) => {
  const [quantity, setQuantity] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Incrementar cantidad
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  // Decrementar cantidad
  const handleDecrement = () => {
    setQuantity(prev => Math.max(0, prev - 1));
  };

  // Cambio manual de cantidad
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (quantity < 1) {
      alert('La cantidad mínima es 1');
      return;
    }

    setIsAdding(true);

    const result = addToCart(product, quantity);

    if (result.success) {
      // Resetear cantidad
      setQuantity(0);
      
      // Notificar al padre (opcional)
      if (onAddSuccess) {
        onAddSuccess(result.cart);
      }

      // Mostrar mensaje de éxito
      alert('Producto agregado al carrito');
    } else {
      alert(result.message || 'Error al agregar producto');
    }

    setIsAdding(false);
  };

  return (
    <div className="product-card">
      {/* Imagen del producto */}
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-image-placeholder"></div>
        )}
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-name">{product.name || 'Producto'}</h3>
        <p className="product-price">${product.price?.toFixed(2) || '0.00'}</p>

        {/* Controles de cantidad */}
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={handleDecrement}
            disabled={isAdding}
            aria-label="Decrementar cantidad"
          >
            −
          </button>
          
          <input
            type="number"
            className="quantity-input"
            value={quantity}
            onChange={handleQuantityChange}
            min="0"
            disabled={isAdding}
            aria-label="Cantidad"
          />
          
          <button 
            className="quantity-btn"
            onClick={handleIncrement}
            disabled={isAdding}
            aria-label="Incrementar cantidad"
          >
            +
          </button>

          <button 
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={isAdding || quantity < 1}
          >
            {isAdding ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;