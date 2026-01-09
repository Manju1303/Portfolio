document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
    };

    const btn = this.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'SENDING...';

    try {
        const response = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Message sent successfully!');
            this.reset();
        } else {
            alert('Failed to send message.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Check if the server is running.');
    } finally {
        btn.textContent = originalText;
    }
});
