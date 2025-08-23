// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    class PortfolioWebsite {
        constructor() {
            this.currentSection = 'home';
            this.uploadedResume = null;
            this.init();
        }

        init() {
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupProfileUpload();
            this.setupResumeUpload();
            this.setupContactForm();
            this.setupScrollEffects();
            this.handleInitialLoad();
        }

        handleInitialLoad() {
            const hash = window.location.hash.substring(1);
            const initialSection = hash && document.getElementById(hash) ? hash : 'home';
            this.navigateToSection(initialSection, false);
        }

        // Navigation System
        setupNavigation() {
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                // Remove any existing event listeners
                link.onclick = null;
                
                // Add new event listener
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetSection = link.getAttribute('data-section');
                    console.log('Clicked nav link:', targetSection);
                    if (targetSection) {
                        this.navigateToSection(targetSection);
                    }
                });
            });

            // Handle browser back/forward
            window.addEventListener('popstate', (e) => {
                const section = e.state?.section || 'home';
                this.navigateToSection(section, false);
            });
        }

        navigateToSection(sectionId, pushState = true) {
            console.log('Navigating to section:', sectionId);

            // Hide all sections
            const allSections = document.querySelectorAll('.section');
            allSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error('Section not found:', sectionId);
                return;
            }

            // Update navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Update browser history
            if (pushState) {
                history.pushState({ section: sectionId }, '', `#${sectionId}`);
            }

            this.currentSection = sectionId;

            // Close mobile menu if open
            this.closeMobileMenu();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Mobile Menu
        setupMobileMenu() {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');

            if (hamburger && navMenu) {
                hamburger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMobileMenu();
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                        this.closeMobileMenu();
                    }
                });
            }
        }

        toggleMobileMenu() {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            }
        }

        closeMobileMenu() {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }

        // Profile Picture Upload
        setupProfileUpload() {
            const profileUpload = document.getElementById('profile-upload');
            const profilePicture = document.getElementById('profile-picture');
            const pictureWrapper = document.querySelector('.profile-picture-wrapper');

            if (!profileUpload || !profilePicture || !pictureWrapper) {
                console.warn('Profile upload elements not found');
                return;
            }

            // Click to upload
            pictureWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                profileUpload.click();
            });

            // Handle file selection
            profileUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && this.isValidImage(file)) {
                    this.displayProfilePicture(file);
                }
            });

            // Drag and drop for profile picture
            pictureWrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                pictureWrapper.style.transform = 'scale(1.05)';
            });

            pictureWrapper.addEventListener('dragleave', (e) => {
                e.preventDefault();
                pictureWrapper.style.transform = 'scale(1)';
            });

            pictureWrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                pictureWrapper.style.transform = 'scale(1)';
                
                const file = e.dataTransfer.files[0];
                if (file && this.isValidImage(file)) {
                    this.displayProfilePicture(file);
                }
            });
        }

        isValidImage(file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                this.showNotification('Please upload a valid image file (JPG, PNG, GIF, or WebP)', 'error');
                return false;
            }

            if (file.size > maxSize) {
                this.showNotification('Image file size should be less than 5MB', 'error');
                return false;
            }

            return true;
        }

        displayProfilePicture(file) {
            const profilePicture = document.getElementById('profile-picture');
            const reader = new FileReader();

            reader.onload = (e) => {
                profilePicture.src = e.target.result;
                this.showNotification('Profile picture updated successfully!', 'success');
            };

            reader.readAsDataURL(file);
        }

        // Resume Upload System
        setupResumeUpload() {
            const resumeUpload = document.getElementById('resume-upload');
            const uploadArea = document.getElementById('resume-upload-area');
            const resumePreview = document.getElementById('resume-preview');
            const downloadBtn = document.getElementById('download-resume');
            const removeBtn = document.getElementById('remove-resume');

            if (!resumeUpload || !uploadArea) {
                console.warn('Resume upload elements not found');
                return;
            }

            // Click to upload
            uploadArea.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                resumeUpload.click();
            });

            // Drag and drop events
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                
                const file = e.dataTransfer.files[0];
                if (file && this.isValidResume(file)) {
                    this.handleResumeUpload(file);
                }
            });

            // File input change
            resumeUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && this.isValidResume(file)) {
                    this.handleResumeUpload(file);
                }
            });

            // Download button
            if (downloadBtn) {
                downloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.downloadResume();
                });
            }

            // Remove button
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.removeResume();
                });
            }
        }

        isValidResume(file) {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!validTypes.includes(file.type)) {
                this.showNotification('Please upload a valid resume file (PDF, DOC, or DOCX)', 'error');
                return false;
            }

            if (file.size > maxSize) {
                this.showNotification('Resume file size should be less than 10MB', 'error');
                return false;
            }

            return true;
        }

        handleResumeUpload(file) {
            // Show loading state
            const uploadArea = document.getElementById('resume-upload-area');
            uploadArea.classList.add('loading');

            // Simulate upload progress
            const progressBar = document.createElement('div');
            progressBar.className = 'upload-progress';
            progressBar.style.width = '0%';
            uploadArea.appendChild(progressBar);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    this.completeResumeUpload(file);
                }
                progressBar.style.width = progress + '%';
            }, 100);
        }

        completeResumeUpload(file) {
            const uploadArea = document.getElementById('resume-upload-area');
            const resumePreview = document.getElementById('resume-preview');
            const resumeName = document.getElementById('resume-name');
            const resumeSize = document.getElementById('resume-size');

            // Store the file
            this.uploadedResume = file;

            // Update UI
            uploadArea.classList.remove('loading');
            uploadArea.style.display = 'none';
            resumePreview.classList.remove('hidden');

            if (resumeName) resumeName.textContent = file.name;
            if (resumeSize) resumeSize.textContent = this.formatFileSize(file.size);

            // Remove progress bar
            const progressBar = uploadArea.querySelector('.upload-progress');
            if (progressBar) {
                progressBar.remove();
            }

            this.showNotification('Resume uploaded successfully!', 'success');
        }

        downloadResume() {
            if (!this.uploadedResume) {
                this.showNotification('No resume file found', 'error');
                return;
            }

            const url = URL.createObjectURL(this.uploadedResume);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.uploadedResume.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('Resume download started', 'success');
        }

        removeResume() {
            const uploadArea = document.getElementById('resume-upload-area');
            const resumePreview = document.getElementById('resume-preview');
            const resumeUpload = document.getElementById('resume-upload');

            // Clear the file
            this.uploadedResume = null;
            if (resumeUpload) resumeUpload.value = '';

            // Update UI
            if (uploadArea) uploadArea.style.display = 'block';
            if (resumePreview) resumePreview.classList.add('hidden');

            this.showNotification('Resume removed', 'info');
        }

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Contact Form
        setupContactForm() {
            const contactForm = document.getElementById('contact-form');

            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleContactForm(contactForm);
                });

                // Ensure form fields are properly focusable
                const formInputs = contactForm.querySelectorAll('input, textarea');
                formInputs.forEach(input => {
                    input.addEventListener('focus', () => {
                        input.style.outline = 'none';
                        input.style.borderColor = 'var(--color-primary)';
                    });
                    
                    input.addEventListener('blur', () => {
                        input.style.borderColor = 'var(--color-border)';
                    });
                });
            }
        }

        handleContactForm(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                this.showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!this.isValidEmail(data.email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            }, 2000);
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Scroll Effects
        setupScrollEffects() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            let ticking = false;

            const updateNavbar = () => {
                const scrollY = window.scrollY;
                
                if (scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.15)';
                    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
                    navbar.style.backdropFilter = 'blur(25px)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.1)';
                    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
                    navbar.style.backdropFilter = 'blur(20px)';
                }
                
                ticking = false;
            };

            const onScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', onScroll);
        }

        // Notification System
        showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());

            // Create notification
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            
            const messageSpan = document.createElement('span');
            messageSpan.className = 'notification-message';
            messageSpan.textContent = message;
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'notification-close';
            closeBtn.innerHTML = '&times;';
            
            notification.appendChild(messageSpan);
            notification.appendChild(closeBtn);

            // Add styles
            Object.assign(notification.style, {
                position: 'fixed',
                top: '90px',
                right: '20px',
                zIndex: '10000',
                padding: '16px 20px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '400px',
                animation: 'slideInRight 0.3s ease-out'
            });

            // Set background color based on type
            const colors = {
                success: '#10B981',
                error: '#EF4444',
                warning: '#F59E0B',
                info: '#3B82F6'
            };
            notification.style.backgroundColor = colors[type] || colors.info;

            // Style close button
            Object.assign(closeBtn.style, {
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            // Add animation styles if not already added
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            // Add to DOM
            document.body.appendChild(notification);

            // Close functionality
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }
    }

    // Initialize the portfolio website
    const portfolioInstance = new PortfolioWebsite();
    window.portfolioInstance = portfolioInstance;
});