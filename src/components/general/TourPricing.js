import React, { useState } from 'react';

export default function TourPricing({tabsQuery1,tabsQuery2}) {
    const [pricePerPerson, setPricePerPerson] = useState('');
    const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
    const [discounts, setDiscounts] = useState([
        { people: 3, discount: 4 },
        { people: 4, discount: 6 },
        { people: 5, discount: 8 },
        { people: 6, discount: 10 },
    ]);

    // Función para manejar el cambio de precios
    const handlePriceChange = (e) => setPricePerPerson(e.target.value);

    // Función para agregar un nuevo descuento
    const addDiscount = () => {
        setDiscounts([...discounts, { people: 1, discount: 0 }]);
    };

    // Función para eliminar un descuento
    const removeDiscount = (index) => {
        setDiscounts(discounts.filter((_, i) => i !== index));
    };

    // Función para actualizar el descuento
    const handleDiscountChange = (index, field, value) => {
        const updatedDiscounts = discounts.map((discount, i) => 
            i === index ? { ...discount, [field]: value } : discount
        );
        setDiscounts(updatedDiscounts);
    };

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-800">Tour Pricing</h1>

            {/* Precio por persona */}
            <div className="">
                <label className="block text-gray-700 font-medium">Price per Person</label>
                <input
                    type="number"
                    value={pricePerPerson}
                    min="1"
                    onChange={handlePriceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Enter price per person"
                />
            </div>

            {/* Checkbox para habilitar descuentos */}
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={isDiscountEnabled}
                    onChange={() => setIsDiscountEnabled(!isDiscountEnabled)}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                />
                <label className="text-gray-700 font-medium">Enable Discounts</label>
            </div>

            {/* Lista de descuentos */}
            {isDiscountEnabled && (
                <div className="space-y-4">
                    <h2 className="text-xl font-medium text-gray-700">Discounts</h2>
                    {discounts.map((discount, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <label className="text-gray-700">For</label>
                            <input
                                type="number"
                                value={discount.people}
                                onChange={(e) => handleDiscountChange(index, 'people', e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                min="1"
                                placeholder="People"
                            />
                            <label className="text-gray-700">people - Discount</label>
                            <input
                                type="number"
                                value={discount.discount}
                                onChange={(e) => handleDiscountChange(index, 'discount', e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                min="0"
                                placeholder="%"
                            />
                            <span>%</span>
                            <button
                                onClick={() => removeDiscount(index)}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addDiscount}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
                    >
                        Add Discount
                    </button>
                </div>
            )}
        </div>
    );
}
