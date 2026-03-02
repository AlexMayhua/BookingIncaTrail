import { useState, useEffect, useContext } from 'react';
import { API_URL } from '../../../lib/constants';
import { useRouter } from 'next/router';
import { DataContext } from '../../../store/GlobalState';

export default function CrearCupon() {
  const { state } = useContext(DataContext);
  const { auth } = state;
  const router = useRouter();

  useEffect(() => {
    
    if (auth.user?.role !== 'admin') {
      
      router.push('/signin'); 
    }
  }, [auth, router]);
  if (!auth.user || auth.user.role !== 'admin') {
    return null;
  }

  const [cupon, setCupon] = useState({
    code: '',
    quantity: 0,
    discount: 0,
    description: ''
  });
  const [cupones, setCupones] = useState([]);
  const [editando, setEditando] = useState(false);
  const [cuponId, setCuponId] = useState(null);
  
  useEffect(() => {
    obtenerCupones();
  }, []);

  const obtenerCupones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`);
      if (res.ok) {
        const data = await res.json();
        setCupones(data);
      } else {
        throw new Error('Error al obtener los cupones');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al obtener los cupones');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCupon(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editando ? 'PUT' : 'POST';
      const url = editando ? `${API_URL}/api/admin/coupons` : `${API_URL}/api/admin/coupons`;

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...cupon, id: cuponId })
      });

      if (res.ok) {
        alert(`Cupón ${editando ? 'editado' : 'creado'} exitosamente`);
        setCupon({ code: '', quantity: 0, discount: 0, description: '' });
        setEditando(false);
        setCuponId(null);
        obtenerCupones();
      } else {
        throw new Error(`Error al ${editando ? 'editar' : 'crear'} el cupón`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al ${editando ? 'editar' : 'crear'} el cupón`);
    }
  };

  const handleEdit = (cupon) => {
    setEditando(true);
    setCuponId(cupon._id); // Usamos `_id` porque MongoDB utiliza este formato para los IDs
    setCupon({
      code: cupon.code,
      quantity: cupon.quantity,
      discount: cupon.discount,
      description: cupon.description
    });
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
      try {
        const res = await fetch(`${API_URL}/api/admin/coupons?id=${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          alert('Cupón eliminado exitosamente');
          obtenerCupones();
        } else {
          throw new Error('Error al eliminar el cupón');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al eliminar el cupón');
      }
    }
  };

  return (
    <div className="max-max mx-auto mt-10 md:mx-20">
      <h1 className="text-2xl font-bold mb-5 text-center">{editando ? 'Editar Cupón' : 'Crear Cupón de Descuento'}</h1>
      <div className='grid lg:grid-cols-3 p-2'>
        <div className='flex justify-end lg:col-span-1'>
          <form onSubmit={handleSubmit} className="space-y-4 py-4 lg:w-1/2 w-full px-4 bg-gray-50 shadow rounded-l">
            <div>
              <label htmlFor="code" className="block mb-1">Código:</label>
              <input
                type="text"
                id="code"
                name="code"
                value={cupon.code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block mb-1">Cantidad:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={cupon.quantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="discount" className="block mb-1">Descuento (%):</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={cupon.discount}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">Descripción:</label>
              <textarea
                id="description"
                name="description"
                value={cupon.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary">
              {editando ? 'Guardar Cambios' : 'Crear Cupón'}
            </button>
          </form>
        </div>

        <div className='bg-white shadow rounded-r p-4 overflow-hidden overflow-x-auto lg:col-span-2'>
          <h2 className="text-xl font-bold mb-3">Listado de Cupones</h2>
          <table className="min-w-full border-collapse border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Código</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Descuento (%)</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Estado</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cupones.map((cupon) => (
                <tr key={cupon._id}>
                  <td className="border p-2">{cupon.code}</td>
                  <td className="border p-2">{cupon.quantity}</td>
                  <td className="border p-2">
                    <span className="mr-2 font-medium">{cupon.discount}%</span>
                    <span className="block w-full h-2 bg-gray-200 rounded-sm relative">
                      <span className="absolute left-0 top-0 h-2 bg-secondary rounded-ms" style={{ width: `${cupon.discount}%` }}></span>
                    </span>
                  </td>
                  <td className="border p-2 font-medium">{cupon.description}</td>
                  <td className="border p-2 text-center">
                    {cupon.quantity > 0 ? (
                      <span className="py-1 px-2 rounded text-xs text-green-500">Activo</span>
                    ) : (
                      <span className="py-1 px-2 rounded text-xs text-red-500">Inactivo</span>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEdit(cupon)}
                      className="text-secondary py-1 px-2 rounded text-xs mr-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(cupon._id)}
                      className="text-red-600 py-1 px-2 rounded text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5">
                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
