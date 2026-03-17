export const ACTIONS = {
  NOTIFY: 'NOTIFY',
  ADD_CART: 'ADD_CART',
  ADD_MODAL: 'ADD_MODAL',
  ADD_ORDERS: 'ADD_ORDERS',
};

export const deleteItem = (data, id, type) => {
  const newData = data.filter((item) => item._id !== id);
  return { type, payload: newData };
};

export const updateItem = (data, id, post, type) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return { type, payload: newData };
};
