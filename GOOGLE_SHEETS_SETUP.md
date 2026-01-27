# Google Sheets Contact Form Setup

Follow these steps to receive contact form submissions directly in your Google Sheet:

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new sheet named "Portfolio Contacts"
3. In Row 1, add these headers: `Date` | `Name` | `Email` | `Message`

## Step 2: Create the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.message
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Form submitted successfully!"
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment**
4. Select type: **Web app**
5. Set "Execute as": **Me**
6. Set "Who has access": **Anyone**
7. Click **Deploy** and copy the Web App URL

## Step 3: Update Your Portfolio

Replace the form action URL in `index.html` with your Web App URL.

Then update `script.js` to send data as JSON to your script.

---

**Note:** For now, Web3Forms is configured as a reliable fallback.
