const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Form Submission Received:', { name, email, message });
    // Here you would typically use nodemailer to send an email

    // Simulate success
    res.status(200).json({ success: true, message: 'Message received successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
