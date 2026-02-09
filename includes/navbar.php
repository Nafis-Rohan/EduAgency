<!-- Navbar Component -->
<nav class="navbar">
    <div class="navbar-container">
        <div class="navbar-logo">
            <a href="index.html">
                <img src="assets/images/logo.png" alt="Raj Admission Consultancy Logo">
            </a>
        </div>
        <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
        <ul class="navbar-menu">
            <li><a href="index.html" class="<?php echo basename($_SERVER['PHP_SELF']) == 'index.html' ? 'active' : ''; ?>">Home</a></li>
            <li><a href="services.html" class="<?php echo basename($_SERVER['PHP_SELF']) == 'services.html' ? 'active' : ''; ?>">Services</a></li>
            <li><a href="about.html" class="<?php echo basename($_SERVER['PHP_SELF']) == 'about.html' ? 'active' : ''; ?>">About Us</a></li>
            <li><a href="index.html#contact" class="<?php echo basename($_SERVER['PHP_SELF']) == 'contact.html' ? 'active' : ''; ?>">Contact</a></li>
            <li><a href="apply.html" class="btn-apply">Apply Now</a></li>
        </ul>
    </div>
</nav>
