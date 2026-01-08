// routes/bookings.js
// API routes for handling booking inquiries
// Sends email notifications when someone submits a booking request

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create reusable transporter
// Uses Gmail SMTP - requires an App Password (not your regular password)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD  // Gmail App Password
    }
  });
};

// POST /api/bookings - Submit a new booking inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, eventDate, eventType, venue, message } = req.body;

    // Validate required fields
    if (!name || !email || !eventDate || !eventType || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, eventDate, eventType, and message are required'
      });
    }

    // Format the event type for display
    const eventTypeLabels = {
      wedding: 'Wedding',
      corporate: 'Corporate Event',
      private: 'Private Party',
      venue: 'Venue / Bar / Restaurant',
      festival: 'Festival',
      other: 'Other'
    };

    // Build the email content
    const emailHtml = `
      <h2>🎸 New Booking Inquiry!</h2>
      
      <h3>Contact Information</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
      </ul>

      <h3>Event Details</h3>
      <ul>
        <li><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
        <li><strong>Event Type:</strong> ${eventTypeLabels[eventType] || eventType}</li>
        <li><strong>Venue/Location:</strong> ${venue || 'Not specified'}</li>
      </ul>

      <h3>Message</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>

      <hr>
      <p style="color: #666; font-size: 12px;">
        This inquiry was submitted through troniousmusic.com
      </p>
    `;

    const emailText = `
NEW BOOKING INQUIRY!

CONTACT INFORMATION
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}

EVENT DETAILS
- Event Date: ${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Event Type: ${eventTypeLabels[eventType] || eventType}
- Venue/Location: ${venue || 'Not specified'}

MESSAGE
${message}

---
This inquiry was submitted through troniousmusic.com
    `;

    // Send the email
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Tronious Website" <${process.env.EMAIL_USER}>`,
      to: 'tronious@gmail.com',
      replyTo: email,  // So you can reply directly to the inquirer
      subject: 'TRONIOUS - NEW BOOKING INQUIRY!',
      text: emailText,
      html: emailHtml
    });

    console.log(`Booking inquiry sent from ${name} (${email})`);
    res.status(201).json({ success: true, message: 'Inquiry sent successfully' });

  } catch (err) {
    console.error('Error sending booking inquiry:', err);
    res.status(500).json({ error: 'Failed to send inquiry. Please try again.' });
  }
});

module.exports = router;
