import { connect, connection } from "mongoose";

const conn = {
  isConnected: false,
};

export async function dbConnect() {
  if (conn.isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('dbConnect: MONGODB_URI no está definida. Añade .env.local con MONGODB_URI para conectar a la base de datos.');
    return;
  }

  try {
    // Conexión con opciones recomendadas
    const db = await connect(uri, {
      // mongoose 7+ ignora muchas opciones antiguas; dejamos opciones mínimas
      serverSelectionTimeoutMS: 5000,
    });
    conn.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error('dbConnect: error connecting to db:', err && err.message ? err.message : err);
    console.warn('⚠️  La aplicación continuará sin base de datos. Algunas funciones pueden no estar disponibles.');
    // NO lanzar el error - permitir que la app funcione sin DB
    conn.isConnected = false;
  }
}

connection.on("connected", () => {
  // Conexión exitosa a la base de datos
});

connection.on("error", (err) => {
  console.error("Connection error:", err.message);
});
