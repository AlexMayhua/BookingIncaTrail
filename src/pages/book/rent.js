import React, { useState, useMemo } from 'react';

const ProductForm = () => {
  const [cart, setCart] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedServices, setSelectedServices] = useState({
    trainType: '',
    gastronomicExperience: '',
  });

  const trainOptions = [
    { type: 'Básico', cost: 50 },
    { type: 'Normal', cost: 100 },
    { type: 'Mejor', cost: 150 },
    { type: 'Top', cost: 200 },
  ];

  const gastronomicOptions = [
    { type: 'Normal', cost: 20 },
    { type: 'Tradicional', cost: 50 },
    { type: 'Rústico', cost: 80 },
  ];

  const products = [
    { name: 'Bastón', price: 10, description: 'Bastón de trekking', image: '/img/other/bastones.webp' },
    { name: 'Chompa', price: 20, description: 'Chompa de abrigo para el frío', image: '/images/chompa.jpg' },
    { name: 'Mochila', price: 30, description: 'Mochila resistente para caminatas largas', image: '/images/mochila.jpg' },
    { name: 'Sleeping', price: 30, description: 'Sleeping bag compacto y cómodo', image: '/img/other/Sleeping-dormir.webp' },
    { name: 'Carpa', price: 50, description: 'Carpa impermeable para 2 personas', image: '/images/carpa.jpg' },
    { name: 'Linterna', price: 15, description: 'Linterna recargable para camping', image: '/images/linterna.jpg' },
  ];

  const toggleProductsVisibility = () => setShowProducts((prev) => !prev);

  const addItemToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeItemFromCart = (item) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, cartItem) => {
        if (cartItem.name === item.name && cartItem.quantity > 1) {
          acc.push({ ...cartItem, quantity: cartItem.quantity - 1 });
        } else if (cartItem.name !== item.name) {
          acc.push(cartItem);
        }
        return acc;
      }, [])
    );
  };

  const calculateCartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const handleServiceSelection = (value, type, options) => {
    setSelectedServices((prev) => ({ ...prev, [type]: value }));
    const selectedOption = options.find((option) => option.type === value);
    if (selectedOption) addItemToCart(selectedOption);
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={toggleProductsVisibility}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        {showProducts ? 'Ocultar productos rentar' : 'Ver productos rentar'}
      </button>

      {showProducts && (
        <div className="bg-white shadow-lg p-4 rounded-md max-h-[400px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Productos Rentar</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.name} className="flex items-center justify-between border p-2 rounded-md">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => addItemToCart(product)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md"
                >
                  Agregar ${product.price}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Selecciona tipo de tren:</h3>
            <select
              value={selectedServices.trainType}
              onChange={(e) => handleServiceSelection(e.target.value, 'trainType', trainOptions)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Seleccionar</option>
              {trainOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.type} (+${option.cost})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Selecciona experiencia gastronómica:</h3>
            <select
              value={selectedServices.gastronomicExperience}
              onChange={(e) => handleServiceSelection(e.target.value, 'gastronomicExperience', gastronomicOptions)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Seleccionar</option>
              {gastronomicOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.type} (+${option.cost})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Carrito</h3>
            {cart.length > 0 ? (
              <ul>
                {cart.map((item) => (
                  <li key={item.name} className="flex justify-between mb-2">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <div>
                      <span>${item.price * item.quantity}</span>
                      <button
                        onClick={() => removeItemFromCart(item)}
                        className="text-red-500 ml-4"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
            <div className="mt-4 font-bold">Total: ${calculateCartTotal}</div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={toggleProductsVisibility}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => alert(`Compra confirmada. Total: $${calculateCartTotal}`)}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
