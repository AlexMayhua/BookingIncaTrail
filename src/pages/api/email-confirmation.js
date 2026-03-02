import { dbConnect } from "../../utils/db";
import Reservation from '../../models/reservationModel'

dbConnect();
import { Resend } from 'resend';
import { BRAND } from '../../lib/brandConfig'
const resend = new Resend(process.env.RESEND_TOKEN);

export default async function (req, res) {
    const { id } = req.query
    const reservation = await Reservation.findById(id)

    const clientName = reservation.userData[0].firstName;
    const tourTitle = reservation.tour.title;
    const tourImage = reservation.tour.image;
    const tourDate = new Date(reservation.date).toLocaleDateString();
    const numberOfPeople = reservation.userData.length;
    const durationTourDay = reservation.tour.duration;

    const discount = reservation.coupons.discount;
    const priceTotalTour = (reservation.totalPay*(1 - discount / 100));
    const pricePaid = reservation.balance.payment;
    const outstandingBalance = reservation.balance.balance;
    
    const travelersList = reservation.userData.map(user => `<li>${user.firstName} ${user.lastName}</li>`).join('');

    await resend.emails.send({
        from: BRAND.contactEmail,
        to: reservation.userData[0].email,
        subject: `Reservation Tour ${reservation.tour.title} in ${BRAND.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h1 style="color: #4CAF50;">Booking Confirmation</h1>
            <p>Dear ${clientName},</p>
            <p>We are pleased to confirm your reservation for the <strong>${tourTitle}</strong> tour at ${BRAND.name}.</p>
            <img src="${tourImage}" alt="Tour Image" style="width:100%; max-width:600px; margin: 20px 0;">
            
            <h2>Tour Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Tour Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">${tourTitle}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Tour Duration:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">${durationTourDay}</td>
                </tr>
        
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Reserved Date (Tour Start):</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">${tourDate}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Number of Travellers:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">${numberOfPeople}</td>
                </tr>
            </table>
            
            <h2>Travellers Details</h2>
            <ul style="margin: 0; padding: 0 0 20px 20px;">
                ${travelersList}
            </ul>
            
            <h2>Payment Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Total Tour Price:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">$${priceTotalTour.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Price Paid:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">$${pricePaid}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Outstanding Balance:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>$${outstandingBalance}</strong></td>
                </tr>
            </table>
            
            <p>Thank you for choosing ${BRAND.name}. We look forward to making your experience unforgettable.</p>
            
            <p>Best regards,<br>${BRAND.name} Team</p>
            <p style="font-size: 12px; color: #999;">If you have any questions, feel free to contact us at <a href="mailto:${BRAND.contactEmail}">${BRAND.contactEmail}</a>.</p>
          </div>
    
    `,
    });

    res.send('success')
}