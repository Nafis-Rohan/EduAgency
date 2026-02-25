<?php
/**
 * Raj Admission Consultancy - Email Handler
 * Handles form submissions from apply.html
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
$requiredFields = ['fullName', 'phone', 'email', 'settlementStatus', 'universityHistory', 'postalCode', 'city'];
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

// Check if terms were accepted
if (empty($data['termsAccepted']) || $data['termsAccepted'] !== true) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Terms and Privacy Policy must be accepted'
    ]);
    exit;
}

// Sanitize input data
$fullName = htmlspecialchars(strip_tags($data['fullName']));
$phone = htmlspecialchars(strip_tags($data['phone']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$settlementStatus = htmlspecialchars(strip_tags($data['settlementStatus']));
$universityHistory = htmlspecialchars(strip_tags($data['universityHistory']));
$postalCode = htmlspecialchars(strip_tags($data['postalCode']));
$city = htmlspecialchars(strip_tags($data['city']));

// Email configuration (production recipient)
$to = 'afran@rajadmission.com';
$subject = 'New Student Application - Raj Admission Consultancy';

// Create HTML email body
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #25D366; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #25D366; color: white; }
        tr:hover { background: #f5f5f5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Student Application</h2>
            <p>Raj Admission Consultancy</p>
        </div>
        <div class='content'>
            <p><strong>A new student application has been submitted through the website.</strong></p>
            
            <table>
                <tr>
                    <th>Field</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td><strong>Full Name</strong></td>
                    <td>{$fullName}</td>
                </tr>
                <tr>
                    <td><strong>Phone Number</strong></td>
                    <td>{$phone}</td>
                </tr>
                <tr>
                    <td><strong>Email Address</strong></td>
                    <td>{$email}</td>
                </tr>
                <tr>
                    <td><strong>Settlement Status</strong></td>
                    <td>{$settlementStatus}</td>
                </tr>
                <tr>
                    <td><strong>University History</strong></td>
                    <td>{$universityHistory}</td>
                </tr>
                <tr>
                    <td><strong>Postal Code</strong></td>
                    <td>{$postalCode}</td>
                </tr>
                <tr>
                    <td><strong>City</strong></td>
                    <td>{$city}</td>
                </tr>
                <tr>
                    <td><strong>Submission Date</strong></td>
                    <td>" . date('Y-m-d H:i:s') . "</td>
                </tr>
            </table>
            
            <p style='margin-top: 20px;'>
                <strong>Next Steps:</strong><br>
                Please contact the applicant to discuss their eligibility and proceed with the application process.
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
        'message' => 'Application submitted successfully. We will contact you soon.'
    ]);
} else {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try again later or contact us directly.'
    ]);
    
    // Log error (optional - for debugging)
    error_log("Failed to send email for application from: {$email}");
}
?>
