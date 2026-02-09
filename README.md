# Admission Consultancy Website

A complete, production-ready Education Agency website built with HTML5, CSS3, Vanilla JavaScript, and PHP.

## 🎨 Design Features

- **Premium & Trustworthy Design** with Green (#25D366) & White color palette
- **Glassmorphism Cards** for modern UI elements
- **AOS (Animate On Scroll)** for smooth reveal animations
- **Fully Responsive** design for all devices
- **Sticky Navbar** with glass effect
- **WhatsApp Float Button** for easy contact

## 📁 Project Structure

```
EduAgency2/
├── index.html              # Home page with all sections
├── services.html           # Services page
├── about.html              # About Us page
├── apply.html              # Application form page
├── privacy.html            # Privacy Policy page
├── send-mail.php           # PHP email handler
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── script.js       # Main JavaScript
│   │   └── includes.js     # HTML includes loader (optional)
│   └── images/
│       └── logo.png        # Company logo
└── includes/
    ├── navbar.html         # Navbar component (HTML version)
    ├── navbar.php          # Navbar component (PHP version)
    ├── footer.html         # Footer component (HTML version)
    └── footer.php          # Footer component (PHP version)
```

## 🚀 Setup Instructions

### Option 1: Using PHP Server (Recommended)

1. **Requirements:**
   - PHP 7.4 or higher
   - Web server (Apache/Nginx) or PHP built-in server
   - Mail server configured (for email functionality)

2. **Local Development:**

   ```bash
   # Navigate to project directory
   cd EduAgency2

   # Start PHP built-in server
   php -S localhost:8000
   ```

3. **Access the website:**
   - Open browser and go to: `http://localhost`

### Option 2: Static HTML (Without PHP)

The HTML files are self-contained and can be opened directly in a browser. However, the contact form will not work without a PHP server.

## 📧 Email Configuration

The `send-mail.php` file sends emails to `xxxx@gmail.com`. To configure:

1. **Update email recipient** in `send-mail.php`:

   ```php
   $to = 'xxxx@gmail.com'; // Change this to your email
   ```

2. **Configure mail server** (if using local development):
   - For production: Ensure your hosting provider has mail() function enabled
   - For local testing: Use SMTP libraries like PHPMailer

## 🎯 Key Features

### Home Page (index.html)

- Hero section with call-to-action
- Study Abroad partners section
- Who Can Apply section (4 eligibility cards)
- Entry Routes section (GCSE, NVQ, Work Experience)
- Flexible Study options
- Funding & Financial Support information
- Wide Range of Courses
- Locations (London, Manchester, Leeds, etc.)
- Multiple Intakes
- Why Choose Us section
- Testimonials
- Call-to-Action section

### Apply Page (apply.html)

- Complete application form with validation
- AJAX form submission
- Success/error notifications
- Terms & Privacy Policy checkbox

### Services Page (services.html)

- Comprehensive service listings
- Application support
- Educational consultation
- Interview preparation
- Personal statement assistance
- CV writing help
- Extended services

### About Page (about.html)

- Company information
- Statistics (100+ universities, 1000+ students)
- Partner universities
- Culture and values

### Privacy Page (privacy.html)

- Complete privacy policy
- GDPR-compliant content
- Contact information

## 🎨 Color Palette

- **Primary Green:** `#25D366`
- **Primary Green Dark:** `#1da851`
- **Primary Green Light:** `#4ae37a`
- **White:** `#ffffff`
- **Dark Navy:** `#1a1f3a`
- **Text Dark:** `#2c3e50`
- **Text Light:** `#6c757d`

## 📱 Responsive Breakpoints

- **Desktop:** 1200px and above
- **Tablet:** 768px - 1199px
- **Mobile:** Below 768px

## 🔧 Customization

### Update Logo

Replace `assets/images/logo.png` with your logo file.

### Update Contact Information

Edit the footer section in each HTML file or update `includes/footer.html`.

### Update WhatsApp Number

Search and replace `+0191919191` with your WhatsApp number.

### Update Email Address

1. Update recipient in `send-mail.php`
2. Update email links in footer sections

## 📝 Form Fields (apply.html)

1. Full Name (required)
2. Phone Number with country code (required)
3. Email Address (required)
4. Settlement Status (dropdown, required)
5. University History (Yes/No, required)
6. Postal Code (required)
7. City (required)
8. Terms & Privacy Policy acceptance (checkbox, required)

## 🌐 External Dependencies

- **Font Awesome 6.4.0** - Icons
- **AOS Library 2.3.1** - Scroll animations
- **Google Fonts** - Poppins (headings) & Inter (body)
