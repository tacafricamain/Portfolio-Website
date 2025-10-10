# EmailJS Environment Variables Setup

## Current Issue
The contact form shows "Email service is not properly configured" because the EmailJS environment variables are missing.

## Quick Fix for Testing

### Option 1: Create .env file (Recommended)
Create a `.env` file in your project root with:

```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Option 2: Temporary Hardcoded Values (Testing Only)
If you want to test immediately, replace the fallback values in Contact.jsx:

```javascript
const config = {
    serviceId: serviceId || 'service_your_actual_id', // Your real service ID
    templateId: templateId || 'template_your_actual_id', // Your real template ID
    publicKey: publicKey || 'your_actual_public_key' // Your real public key
};
```

## How to Get EmailJS Credentials

1. **Go to** [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. **Sign up/Login**
3. **Create Email Service:**
   - Go to "Email Services" 
   - Click "Add New Service"
   - Choose Gmail/Outlook/etc.
   - Copy the Service ID

4. **Create Email Template:**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Set up your template with variables: {{from_name}}, {{from_email}}, {{message}}
   - Copy the Template ID

5. **Get Public Key:**
   - Go to "Account" → "General"
   - Copy the Public Key

## Template Example
```
Subject: New Contact Form Message

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}
```

## Environment Variables for Vercel
Add the same variables in Vercel Dashboard:
- Go to your project settings
- Environment Variables section
- Add each variable

Restart your development server after adding the .env file!