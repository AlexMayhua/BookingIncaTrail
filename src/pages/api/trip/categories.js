import { dbConnect } from '../../../utils/db';
import Trip from '../../../models/tripModel';

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'GET') {
    try {
      // Obtener categorías únicas de la base de datos
      const categories = await Trip.distinct('category');
      
      // Ordenar alfabéticamente
      const sortedCategories = categories.filter(Boolean).sort();
      
      res.status(200).json({ 
        success: true,
        categories: sortedCategories,
        count: sortedCategories.length
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
        success: false,
        err: error.message 
      });
    }
  } else {
    res.status(405).json({ 
      success: false,
      err: 'Method not allowed' 
    });
  }
}
