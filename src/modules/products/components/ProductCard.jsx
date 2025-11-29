import { useState } from 'react';
import AuthModal from '../../auth/components/AuthModal';

/**
 * Componente que muestra una tarjeta individual de producto
 * Incluye imagen, nombre, precio, controles de cantidad y botA3n para agregar al carrito
 *
 * @component
 * @param {object} product - Objeto del producto con propiedades: id, name, currentUnitPrice, imageUrl, stockQuantity
 * @returns {JSX.Element} Tarjeta del producto con controles de compra
 */
function ProductCard({ product }) {
  // Estado para almacenar la cantidad de unidades que quiere comprar el usuario
  const [quantity, setQuantity] = useState(1);
  
  // Estado para mostrar un mensaje de confirmaciA3n al agregar al carrito
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Estado para mostrar el modal de autenticaciA3n
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Obtenemos el token del localStorage para saber si el usuario estA� autenticado
  const token = localStorage.getItem('token');

  /**
   * Maneja el clic en el botA3n "-" para disminuir la cantidad
   * Asegura que la cantidad no sea menor a 0
   */
  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  /**
   * Maneja el clic en el botA3n "+" para aumentar la cantidad
   * Valida que no exceda el stock disponible
   */
  const handleIncrease = () => {
    // Si la cantidad es menor que el stock disponible, aumentamos
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  /**
   * Maneja el cambio del input directo de cantidad
   * Solo permite nA�meros y respeta los lA-mites de 0 y stock disponible
   */
  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    
    // Validar que estAc entre 0 y el stock disponible
    if (value < 0) value = 0;
    if (value > product.stockQuantity) value = product.stockQuantity;
    
    setQuantity(value);
  };

  /**
   * Agrega el producto al carrito de compras
   * Guarda los datos en localStorage bajo la clave "cart"
   * Requiere que el usuario estAc autenticado
   */
  const handleAddToCart = () => {
    // Validar que el usuario estAc autenticado
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    // Validar que la cantidad sea mayor a 0
    if (quantity === 0) {
      alert('Por favor selecciona una cantidad');
      return;
    }

    // Obtenemos el carrito actual del localStorage (o un array vacA-o si no existe)
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Buscamos si el producto ya estA� en el carrito
    const existingItem = existingCart.find(item => item.id === product.id);

    if (existingItem) {
      // Si ya existe, sumamos la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no existe, lo agregamos como un nuevo item
      existingCart.push({
        ...product,
        quantity,
      });
    }

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Mostramos un mensaje de Acxito
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    
    // Reseteamos la cantidad a 0
    setQuantity(0);
  };

  return (
    <>
      <div className="shadow-l rounded-xl p-4 bg-zinc-900 text-white">
        {/* SecciA3n de imagen del producto */}
        <div className="bg-gray-200 aspect-square overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            // Imagen de placeholder si no hay imagen disponible
            <div className="text-gray-400 text-center w-full h-full flex flex-col items-center justify-center">
              <p>Sin imagen</p>
            </div>
          )}
        </div>

        {/* Sección de información del producto */}
        <div className="p-4">
          {/* Nombre del producto */}
          <h3 className="text-zinc-50 font-semibold h-15 text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Precio del producto */}
          <p className="text-zinc-400 text-xl mb-3">
            ${product.currentUnitPrice.toFixed(2)}
          </p>

          {/* Informacion de stock */}
          {product.stockQuantity > 0 ? (
            <p className="text-zinc-400 text-sm font-medium mb-3">
              Stock: {product.stockQuantity}
            </p>
          ) : (
            <p className="text-red-600 text-sm font-medium mb-3">
              Sin stock
            </p>
          )}

          {/* Controles de cantidad */}
          <div className="flex items-center gap-2 mb-3">
            {/* BotA3n disminuir */}
            <button 
              onClick={handleDecrease}
              disabled={quantity === 0 || product.stockQuantity === 0}
              className="w-10 h-10 shadow-s rounded-xl p-4 bg-zinc-900 text-white flex items-center justify-center 
                         hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition hover:text-zinc-950"
            >
              -
            </button>

            <p className='p-4'>
              {quantity}
            </p>

            {/* BotA3n aumentar */}
            <button 
              onClick={handleIncrease}
              disabled={quantity >= product.stockQuantity || product.stockQuantity === 0}
              className="w-10 h-10 shadow-s rounded-xl p-4 bg-zinc-900 text-white flex items-center justify-center 
                         hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition hover:text-zinc-950"
            >
              +
            </button>
          </div>

          {/* BotA3n agregar al carrito */}
          <button 
            onClick={handleAddToCart}
            disabled={quantity === 0 || product.stockQuantity === 0}
            className="w-full shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-500 disabled:cursor-not-allowed
                     font-semibold py-2"
          >
            Agregar
          </button>

          {/* Mensaje de Acxito */}
          {showSuccess && (
            <p className="text-green-600 text-sm text-center mt-2 font-medium">
              Agregado al carrito
            </p>
          )}
        </div>
      </div>

      {/* Modal de autenticaciA3n - se muestra cuando el usuario intenta agregar sin estar autenticado */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      )}
      
    </>
  );
}

export default ProductCard;
