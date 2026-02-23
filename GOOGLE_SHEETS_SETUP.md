# Google Sheets Contact Form Setup - Complete Guide

Follow these steps to receive contact form submissions directly in your Google Sheet.
Your form data is **100% free** with no third-party services needed!

---

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new sheet named **"Portfolio Contacts"**
3. In **Row 1**, add these headers exactly:

| A | B | C | D | E |
|---|---|---|---|---|
| Date | Name | Email | Subject | Message |

---

## Step 2: Create the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date().toLocaleString(),
    data.name,
    data.email,
    data.subject || 'No subject',
    data.message
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Form submitted successfully!"
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S)
4. Click **Deploy → New deployment**
5. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
6. Set **Description**: "Portfolio Contact Form"
7. Set **Execute as**: **Me** (your Gmail address)
8. Set **Who has access**: **Anyone**
9. Click **Deploy**
10. **Authorize** the script when prompted (click "Advanced" → "Go to project")
11. Copy the **Web App URL** (it looks like: `https://script.google.com/macros/s/ABC.../exec`)

---

## Step 3: Update Your Portfolio

Open `script.js` and find this line (around line 257):

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

**Replace the URL** with your new Web App URL from Step 2.

---

## Want to Use a DIFFERENT Google Sheet?

You can easily switch to a new sheet:

1. Create a **new** Google Sheet with the same headers (Date | Name | Email | Subject | Message)
2. Open **Extensions → Apps Script** in the new sheet
3. Paste the **same** code from Step 2
4. Deploy as a **new** Web app
5. Copy the **new URL** and update it in `script.js`

That's it! Each sheet gets its own unique URL.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Form says "Sent" but no data in sheet** | Make sure your Apps Script is deployed as "Anyone" can access |
| **Authorization error** | Re-deploy the script and accept permissions again |
| **CORS error in console** | The `mode: 'no-cors'` setting in the code handles this - form will work even with this warning |
| **Want email notifications** | Add this to your Apps Script: `MailApp.sendEmail('your@email.com', 'New Contact', data.name + ': ' + data.message);` |

---

## Add Email Notifications (Optional)

To get an email whenever someone fills the form, update your Apps Script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date().toLocaleString(),
    data.name,
    data.email,
    data.subject || 'No subject',
    data.message
  ]);
  
  // Send email notification
  MailApp.sendEmail({
    to: 'manjunathkaids23@jkkmct.edu.in',
    subject: 'New Portfolio Contact: ' + (data.subject || data.name),
    body: 'Name: ' + data.name + '\n' +
          'Email: ' + data.email + '\n' +
          'Subject: ' + (data.subject || 'N/A') + '\n' +
          'Message: ' + data.message + '\n\n' +
          'Sent from your Portfolio website'
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true
  })).setMimeType(ContentService.MimeType.JSON);
}
```

After updating, **redeploy** your script (Deploy → Manage deployments → Edit → New version → Deploy).

---

**Your contact form is now fully functional with zero cost! 🚀**
