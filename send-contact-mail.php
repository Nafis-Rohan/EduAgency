<?php
/**
 * Raj Admission Consultancy - Contact Form Email Handler
 * Handles form submissions from contact.html
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate JSON data
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON data'
    ]);
    exit;
}

// Validate required fields
$requiredFields = ['name', 'email', 'message'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Missing required field: $field"
        ]);
        exit;
    }
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(strip_tags($data['name']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(strip_tags($data['message']));

// Email configuration
$to = 'afran@rajadmission.com';
$subject = 'New Contact Form Enquiry - Raj Admission Consultancy';

// Create HTML email body
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
                <tr>
                    <th>Field</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td><strong>Name</strong></td>
                    <td>{$name}</td>
                </tr>
                <tr>
                    <td><strong>Email Address</strong></td>
                    <td>{$email}</td>
                </tr>
                <tr>
                    <td><strong>Submission Date</strong></td>
                    <td>" . date('Y-m-d H:i:s') . "</td>
                </tr>
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

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Raj Admission Consultancy <noreply@rajadmission.com>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mailSent = @mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully. We will get back to you soon.'
    ]);
} else {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again later or contact us directly.'
    ]);
    
    // Log error (optional - for debugging)
    error_log("Failed to send email for contact form from: {$email}");
}
?>
