import { createContext, useReducer, useEffect } from 'react';
import reducers from './Reducers';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    cart: [],
    modal: [],
    orders: [],
  };

  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

  useEffect(() => {
    const ecommerce_next = JSON.parse(localStorage.getItem('ecommerce_next'));

    if (ecommerce_next) dispatch({ type: 'ADD_CART', payload: ecommerce_next });
  }, []);

  useEffect(() => {
    localStorage.setItem('ecommerce_next', JSON.stringify(cart));
  }, [cart]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
