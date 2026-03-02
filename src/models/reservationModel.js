import mongoose from 'mongoose'

// Esquema para los datos de un pasajero
const PassengerSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    dateOfBirth: { type: Date },
    specialRequirements: { type: String, trim: true }
}, { _id: false });

// Esquema para el snapshot del tour (datos al momento de la reserva)
const TourSnapshotSchema = new mongoose.Schema({
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'trip', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String },
    description: { type: String }
}, { _id: false });

// Esquema para el balance de pago
const BalanceSchema = new mongoose.Schema({
    total: { type: Number, required: true, default: 0 },       // Total de la reserva
    paid: { type: Number, required: true, default: 0 },        // Monto pagado
    balance: { type: Number, required: true, default: 0 }      // Saldo pendiente
}, { _id: false });

// Esquema para cupones aplicados
const CouponSchema = new mongoose.Schema({
    code: { type: String, uppercase: true, trim: true },
    discount: { type: Number, min: 0, max: 100 },              // Porcentaje de descuento
    description: { type: String }
}, { _id: false });

const ReservationSchema = new mongoose.Schema({
    // Datos de los pasajeros
    userData: {
        type: [PassengerSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one passenger is required'
        }
    },

    // Snapshot del tour al momento de la reserva
    tour: {
        type: TourSnapshotSchema,
        required: true
    },

    // Fecha de inicio del tour
    date: {
        type: Date,
        required: true
    },

    // Tipo de servicio: 'Group' o 'Private'
    serviceType: {
        type: String,
        enum: ['Group', 'Private'],
        required: true,
        default: 'Group'
    },

    // Monto total a pagar
    totalPay: {
        type: Number,
        required: true,
        min: 0
    },

    // Balance de pagos
    balance: {
        type: BalanceSchema,
        required: true,
        default: () => ({ total: 0, paid: 0, balance: 0 })
    },

    // Cupones aplicados
    coupons: {
        type: CouponSchema,
        default: null
    },

    // Estado de pago
    isPay: {
        type: Boolean,
        default: false,
        required: true
    },

    // Estado de la reserva
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },

    // Notas adicionales del admin
    adminNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Índices para mejorar rendimiento
ReservationSchema.index({ date: 1, 'tour.tourId': 1 });
ReservationSchema.index({ 'userData.email': 1 });
ReservationSchema.index({ status: 1, isPay: 1 });
ReservationSchema.index({ createdAt: -1 });

// Método para calcular el balance
ReservationSchema.methods.calculateBalance = function() {
    this.balance.total = this.totalPay;
    this.balance.balance = this.balance.total - this.balance.paid;
    return this.balance;
};

// Método para verificar si está completamente pagado
ReservationSchema.methods.isFullyPaid = function() {
    return this.balance.paid >= this.balance.total;
};

let Dataset = mongoose.models.reservation || mongoose.model('reservation', ReservationSchema)
export default Dataset