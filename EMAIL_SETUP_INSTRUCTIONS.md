# How to Enable Email Sending

To make the form actually send emails to `manjunathkaids23@jkkmct.edu.in`, you need to give the server permission to send emails on your behalf.

## Step 1: Get a Google App Password
(If you are using a Gmail account to *send* the emails)

1.  Go to your **Google Account** settings.
2.  Search for **"App Passwords"** (You must have 2-Step Verification enabled first).
3.  Create a new App Password (name it "Portfolio").
4.  Copy the 16-character code.

## Step 2: Update `server.js`

1.  Open `d:\Github\portfolio\server.js`.
2.  Find lines 16-17:
    ```javascript
    user: 'YOUR_EMAIL@gmail.com', // ⚠️ REPLACE THIS
    pass: 'YOUR_APP_PASSWORD'     // ⚠️ REPLACE THIS
    ```
3.  Replace `YOUR_EMAIL@gmail.com` with your actual Gmail address.
4.  Replace `YOUR_APP_PASSWORD` with the code you copied.

## Step 3: Restart Server

1.  Close the black "Server" window if it's open.
2.  Double-click `start_server.bat` again.
