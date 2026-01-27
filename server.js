const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Nodemailer transporter with Gmail App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'manjunathkaids23@jkkmct.edu.in', // Your email
        pass: 'htlz issn wgge jdrk' // App Password for "Portfolio"
    }
});

app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;
    console.log('Form Submission Received:', { name, email, message });

    try {
        // Email to yourself (notification of new message)
        await transporter.sendMail({
            from: `"Portfolio Contact" <manjunathkaids23@jkkmct.edu.in>`,
            to: 'manjunathkaids23@jkkmct.edu.in',
            subject: `New Contact from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        console.log('Email sent successfully!');
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
