# cPanel Deployment Guide - Brevo SMTP Configuration

## Step 1: Push Code to Git

Pastikan semua perubahan sudah di-push ke repository:

```bash
git add .
git commit -m "feat: add enhanced email logging and Brevo SMTP support"
git push origin main
```

## Step 2: Pull di cPanel

### Via SSH (Recommended)
```bash
# Login ke cPanel via SSH
ssh username@your-server.com

# Navigate to project directory
cd ~/public_html/api-backend  # atau path project Anda

# Pull latest changes
git pull origin main

# Install dependencies (jika ada perubahan package.json)
npm install

# Restart aplikasi
pm2 restart octobees-api  # atau nama pm2 app Anda
# ATAU
systemctl restart your-app-name
```

### Via cPanel File Manager + Terminal
1. Login ke cPanel
2. Buka **Terminal**
3. Jalankan commands di atas

## Step 3: Configure Environment Variables di cPanel

### Opsi A: Edit .env File (Recommended)

1. **Via File Manager:**
   - Login cPanel → File Manager
   - Navigate ke folder project
   - Klik kanan `.env` → Edit
   - Tambahkan/update konfigurasi Brevo:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=99ca3b001@smtp-brevo.com
SMTP_PASS=your-brevo-smtp-key
SMTP_FROM_NAME=OCTOBEES Affiliate Team
SMTP_FROM_EMAIL=no-reply@octobees.com
```

2. **Save** file
3. **Restart** aplikasi

### Opsi B: Via SSH

```bash
# Navigate to project
cd ~/public_html/api-backend

# Edit .env
nano .env

# Tambahkan konfigurasi Brevo (paste dari atas)
# Ctrl+X, Y, Enter untuk save

# Restart app
pm2 restart octobees-api
```

### Opsi C: Environment Variables di cPanel (Advanced)

Jika menggunakan Node.js App di cPanel:
1. cPanel → **Setup Node.js App**
2. Pilih aplikasi Anda
3. Scroll ke **Environment Variables**
4. Add variables satu per satu:
- `SMTP_HOST` = `smtp-relay.brevo.com`
- `SMTP_PORT` = `587`
- `SMTP_SECURE` = `false`
- `SMTP_USER` = `99ca3b001@smtp-brevo.com`
- `SMTP_PASS` = `<your-brevo-smtp-key>` (full key)
- `SMTP_FROM_NAME` = `OCTOBEES Affiliate Team`
- `SMTP_FROM_EMAIL` = `no-reply@octobees.com`
5. **Restart** aplikasi

## Step 4: Verify Domain di Brevo

**PENTING:** Email FROM harus menggunakan domain yang sudah verified!

1. Login ke https://app.brevo.com
2. **Senders & IP** → **Domains**
3. Pastikan `octobees.com` sudah verified
4. Jika belum:
   - Add domain
   - Tambahkan DNS records yang diminta
   - Wait for verification

**Alternatif:** Gunakan email yang sudah verified sebagai FROM:
```env
SMTP_FROM_EMAIL=verified-email@yourdomain.com
```

## Step 5: Test Email Sending

### Via Postman
```
POST {{base_url}}/api/v1/back-office/affiliate/applications/:id/approve

Response should show:
{
  "status": "success",
  "data": {
    "message": "Affiliate approved",
    "emailSent": true,  // ← Should be TRUE!
    "changePasswordUrl": "..."
  }
}
```

### Via cURL
```bash
curl -X POST "https://your-domain.com/api/v1/back-office/affiliate/applications/{id}/approve"
```

### Check Logs
```bash
# Via SSH
tail -f ~/public_html/api-backend/logs/error.log
tail -f ~/public_html/api-backend/logs/access.log
```

Look for:
- ✅ `INFO: Sending approval email to ...`
- ✅ `INFO: Affiliate approval email HTML generated`
- ❌ `ERROR: Failed to send affiliate email` (jika ada error)

## Step 6: Verify di Brevo Dashboard

1. Login ke https://app.brevo.com
2. **Statistics** → **Email**
3. Lihat email yang baru terkirim
4. Klik untuk preview dan verify password ada

## Troubleshooting

### Email masih `emailSent: false`

1. **Check SMTP credentials:**
   ```bash
   cat .env | grep SMTP
   ```
   Pastikan semua nilai benar

2. **Check logs untuk error detail:**
   ```bash
   tail -50 logs/error.log | grep -i "email\|smtp"
   ```

3. **Test SMTP connection:**
   Create `test-smtp.js`:
   ```javascript
   import nodemailer from "nodemailer";
   import dotenv from "dotenv";
   dotenv.config();

   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: process.env.SMTP_SECURE === "true",
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });

   transporter.verify((error, success) => {
     if (error) {
       console.error("❌ SMTP Failed:", error);
     } else {
       console.log("✅ SMTP Connected!");
     }
   });
   ```
   
   Run: `node test-smtp.js`

4. **Restart app setelah perubahan .env:**
   ```bash
   pm2 restart octobees-api
   # atau
   pm2 restart all
   ```

### FROM email not verified

Jika error: `Sender email not verified`:
- Verify domain di Brevo
- Atau gunakan email yang sudah verified

### Port blocked

Jika error: `Connection timeout`:
- Coba port 465 dengan `SMTP_SECURE=true`
- Contact hosting support untuk unblock SMTP ports

## Summary Checklist

- [ ] Code di-push ke git
- [ ] Pull di cPanel
- [ ] `.env` updated dengan Brevo config
- [ ] Domain verified di Brevo (atau gunakan verified email)
- [ ] App di-restart
- [ ] Test approval → `emailSent: true`
- [ ] Verify email di Brevo dashboard
- [ ] Check email received dengan password
