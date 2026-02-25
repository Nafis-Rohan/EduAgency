<?php

/**
 * Raj Admission Consultancy - Contact Form Email Handler
 * Handles form submissions from contact.html
 *
 * FIXES APPLIED:
 * 1. From header now uses afran@rajadmission.com (real cPanel email - prevents rejection)
 * 2. $to now sends directly to your Outlook email
 * 3. CORS locked to your domain only (security fix)
 * 4. Removed @ error suppression from mail() so failures are visible in logs
 */

// ============================================================
// CONFIGURATION — Edit these values before deploying
// ============================================================
$YOUR_OUTLOOK_EMAIL = 'shafakatarnob98@outlook.com';   // <-- Change this to your real Outlook email
$FROM_EMAIL         = 'afran@rajadmission.com';  // Must match a real cPanel email account
$FROM_NAME          = 'Raj Admission Consultancy';
$ALLOWED_ORIGIN     = 'https://rajadmission.com'; // Your live domain
// ============================================================

// Lock CORS to your domain only (NOT wildcard *)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$requiredFields = ['name', 'email', 'message'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Sanitize input
$name    = htmlspecialchars(strip_tags($data['name']));
$email   = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(strip_tags($data['message']));

// Email destination and subject
$to      = $YOUR_OUTLOOK_EMAIL;
$subject = 'New Contact Form Enquiry - Raj Admission Consultancy';

// HTML email body
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f6b76; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #0f6b76; color: white; }
        tr:hover { background: #f5f5f5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #0f6b76; margin-top: 15px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Enquiry</h2>
            <p>Raj Admission Consultancy</p>
        </div>
        <div class='content'>
            <p><strong>A new enquiry has been submitted through the contact form.</strong></p>
            <table>
                <tr><th>Field</th><th>Details</th></tr>
                <tr><td><strong>Name</strong></td><td>{$name}</td></tr>
                <tr><td><strong>Email Address</strong></td><td>{$email}</td></tr>
                <tr><td><strong>Submission Date</strong></td><td>" . date('Y-m-d H:i:s') . "</td></tr>
            </table>
            <div class='message-box'>
                <strong>Message:</strong><br>
                <p style='margin-top: 10px; white-space: pre-wrap;'>{$message}</p>
            </div>
            <p style='margin-top: 20px;'>
                <strong>Next Steps:</strong><br>
                Please respond to the enquiry as soon as possible.
            </p>
        </div>
        <div class='footer'>
            <p>This email was sent from the Raj Admission Consultancy website contact form.</p>
            <p>&copy; " . date('Y') . " Raj Admission Consultancy Limited. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Email headers — From must use a real cPanel email address
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$FROM_NAME} <{$FROM_EMAIL}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email (removed @ suppression so errors appear in server logs)
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully. We will get back to you soon.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again later or contact us directly.'
    ]);
    error_log("send-contact-mail.php: Failed to send contact email from: {$email}");
}
