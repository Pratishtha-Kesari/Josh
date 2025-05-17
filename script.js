// IIFE to avoid polluting global namespace
(function() {
    'use strict';
    
    // DOM Elements - make them null-safe with optional chaining
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const modal = document.getElementById('modal');
    const modalTriggers = document.querySelectorAll('.btn-primary');
    const closeModal = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const playButton = document.querySelector('.play-button');
    const videoContainer = document.querySelector('.video-container');

    // Testimonial Carousel
    class Carousel {
        constructor(container) {
            this.container = container;
            if (!this.container) return;
            
            this.track = this.container.querySelector('.carousel-track');
            this.slides = Array.from(this.track.children);
            this.nextButton = this.container.querySelector('.next-button');
            this.prevButton = this.container.querySelector('.prev-button');
            this.indicatorsContainer = this.container.querySelector('.carousel-indicators');
            
            this.slideWidth = this.slides[0].getBoundingClientRect().width;
            this.currentIndex = 0;
            this.slideCount = this.slides.length;
            
            this.init();
        }
        
        init() {
            // Create indicator dots
            this.createIndicators();
            
            // Position slides
            this.positionSlides();
            
            // Add event listeners
            this.nextButton.addEventListener('click', () => this.moveToSlide('next'));
            this.prevButton.addEventListener('click', () => this.moveToSlide('prev'));
            
            // Set auto scroll timer
            this.autoScroll = setInterval(() => this.moveToSlide('next'), 5000);
            
            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') this.moveToSlide('next');
                if (e.key === 'ArrowLeft') this.moveToSlide('prev');
            });
            
            // Add touch support
            this.setupTouchEvents();
        }
        
        createIndicators() {
            for (let i = 0; i < this.slideCount; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (i === 0) indicator.classList.add('active');
                
                indicator.addEventListener('click', () => {
                    this.currentIndex = i;
                    this.updateCarousel();
                });
                
                this.indicatorsContainer.appendChild(indicator);
            }
            this.indicators = Array.from(this.indicatorsContainer.children);
        }
        
        positionSlides() {
            this.slides.forEach((slide, index) => {
                slide.style.left = this.slideWidth * index + 'px';
            });
        }
        
        moveToSlide(direction) {
            // Reset autoscroll timer
            clearInterval(this.autoScroll);
            this.autoScroll = setInterval(() => this.moveToSlide('next'), 5000);
            
            if (direction === 'next') {
                this.currentIndex = (this.currentIndex + 1) % this.slideCount;
            } else {
                this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
            }
            
            this.updateCarousel();
        }
        
        updateCarousel() {
            const moveAmount = -this.currentIndex * this.slideWidth;
            this.track.style.transform = `translateX(${moveAmount}px)`;
            
            // Update indicators
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        setupTouchEvents() {
            let startX, moveX, diff;
            const threshold = 100; // Minimum distance to trigger slide change
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].pageX;
                
                // Pause transition during touch
                this.track.style.transition = 'none';
            });
            
            this.track.addEventListener('touchmove', (e) => {
                moveX = e.touches[0].pageX;
                diff = moveX - startX;
                
                // Move the track with the finger
                const currentTransform = -this.currentIndex * this.slideWidth;
                this.track.style.transform = `translateX(${currentTransform + diff}px)`;
            });
            
            this.track.addEventListener('touchend', () => {
                // Restore transition
                this.track.style.transition = 'transform 0.5s ease';
                
                if (diff < -threshold) {
                    // Swipe left - next slide
                    this.moveToSlide('next');
                } else if (diff > threshold) {
                    // Swipe right - previous slide
                    this.moveToSlide('prev');
                } else {
                    // Return to current slide if swipe wasn't strong enough
                    this.updateCarousel();
                }
            });
        }
        
        // Method to resize carousel when window size changes
        resize() {
            this.slideWidth = this.slides[0].getBoundingClientRect().width;
            this.positionSlides();
            this.updateCarousel();
        }
    }

    // Initialize Carousel
    const testimonialCarousel = new Carousel(document.querySelector('.testimonial-carousel'));

    // Handle window resize
    window.addEventListener('resize', () => {
        if (testimonialCarousel) testimonialCarousel.resize();
    });

    // Initialize Video Player
    function initVideoPlayer() {
        const playButton = document.getElementById('playButton');
        const videoThumbnail = document.getElementById('videoThumbnail');
        const youtubePlayer = document.getElementById('youtubePlayer');
        
        if (playButton && videoThumbnail && youtubePlayer) {
            playButton.addEventListener('click', function(e) {
                if (e) e.preventDefault();
                
                // Use data attribute for video ID for easier maintenance
                const videoId = this.dataset.videoId || 'dQw4w9WgXcQ';
                
                // Create iframe with best practices
                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', '100%');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('title', 'YouTube video player');
                
                // For Safari compatibility use opacity instead of display:none
                videoThumbnail.style.opacity = '0';
                videoThumbnail.style.position = 'absolute';
                playButton.style.opacity = '0';
                playButton.style.position = 'absolute';
                playButton.style.pointerEvents = 'none';
                
                // Clear any existing content
                youtubePlayer.innerHTML = '';
                
                // Append iframe to the container
                youtubePlayer.appendChild(iframe);
                youtubePlayer.style.position = 'absolute';
                youtubePlayer.style.top = '0';
                youtubePlayer.style.left = '0';
                youtubePlayer.style.width = '100%';
                youtubePlayer.style.height = '100%';
                youtubePlayer.style.zIndex = '9';
            });
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        initVideoPlayer();
    });

    // Mobile Navigation
    function initMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                
                hamburger.setAttribute('aria-expanded', !isExpanded);
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Toggle hamburger animation
                const bars = hamburger.querySelectorAll('.bar');
                if (hamburger.classList.contains('active')) {
                    bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
                } else {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
            
            // Close mobile menu when pressing Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    // Reset hamburger
                    const bars = hamburger.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                });
            });
        }
    }

    // Modal functionality
    function toggleModal() {
        modal.classList.toggle('active');
        
        // Prevent body scrolling when modal is open
        if (modal.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Open modal on button click
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal();
        });
    });

    // Close modal with X button
    if (closeModal) {
        closeModal.addEventListener('click', toggleModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            toggleModal();
        }
    });

    // Form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would send the form data to a server here
            alert('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would send the form data to a server here
            alert('Thank you for signing up! We will contact you shortly.');
            modalForm.reset();
            toggleModal();
        });
    }

    // Newsletter subscription form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-subscribe').value;
            // In a real application, you would send the newsletter signup to a server
            alert(`Thank you for subscribing to our newsletter with email: ${email}`);
            newsletterForm.reset();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting based on scroll position
    function highlightNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    window.addEventListener('load', highlightNavLink);

    // Add more testimonials
    function addTestimonials() {
        const carouselTrack = document.querySelector('.carousel-track');
        if (!carouselTrack) return;
        
        // Testimonials would typically come from a database or CMS
        // For this example, we'll add placeholder testimonials
        const testimonials = [
            {
                text: '"The platform\'s intuitive design has streamlined our workflow and improved our team\'s productivity by 30%. Highly recommend!"',
                name: 'Michael Roberts',
                position: 'CTO, InnovateTech',
                avatar: 'avatar2.svg'
            },
            {
                text: '"We\'ve been using this service for over a year now, and the results have been nothing short of amazing. Customer support is exceptional!"',
                name: 'Jennifer Williams',
                position: 'Marketing Director, GrowthCorp',
                avatar: 'avatar3.svg'
            }
        ];
        
        testimonials.forEach(testimonial => {
            const slide = document.createElement('div');
            slide.classList.add('testimonial-slide');
            
            slide.innerHTML = `
                <div class="testimonial-content">
                    <div class="testimonial-text">
                        <p>${testimonial.text}</p>
                    </div>
                    <div class="testimonial-author">
                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="author-avatar">
                        <div class="author-info">
                            <h4 class="author-name">${testimonial.name}</h4>
                            <p class="author-position">${testimonial.position}</p>
                        </div>
                    </div>
                </div>
            `;
            
            carouselTrack.appendChild(slide);
        });
        
        // Reinitialize carousel if testimonials were added
        if (testimonialCarousel && testimonials.length > 0) {
            testimonialCarousel.slides = Array.from(testimonialCarousel.track.children);
            testimonialCarousel.slideCount = testimonialCarousel.slides.length;
            testimonialCarousel.createIndicators();
            testimonialCarousel.positionSlides();
        }
    }

    // Video Player - Updated for a working video
    if (playButton && videoContainer) {
        playButton.addEventListener('click', () => {
            // Create an iframe with YouTube embed
            const videoIframe = document.createElement('iframe');
            // Using a real YouTube video ID - this is a demo video about product design
            videoIframe.setAttribute('src', 'https://www.youtube.com/embed/GaQFX1zM-_8?autoplay=1');
            videoIframe.setAttribute('frameborder', '0');
            videoIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            videoIframe.setAttribute('allowfullscreen', '');
            videoIframe.style.position = 'absolute';
            videoIframe.style.top = '0';
            videoIframe.style.left = '0';
            videoIframe.style.width = '100%';
            videoIframe.style.height = '100%';
            
            // Clear the video container and add the iframe
            videoContainer.innerHTML = '';
            videoContainer.style.paddingBottom = '56.25%'; // 16:9 Aspect Ratio
            videoContainer.style.height = '0';
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(videoIframe);
        });
    }

    // Initialize dynamic content
    document.addEventListener('DOMContentLoaded', () => {
        addTestimonials();
        
        // More initialization if needed
    });

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all components
        initMobileMenu();
        initVideoPlayer();
        initTestimonialCarousel();
        initForms();
        
        // Fix for Safari's back button cache issue
        window.onpageshow = function(event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
    });

    // Initialize Testimonial Carousel
    function initTestimonialCarousel() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const carouselTrack = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!prevButton || !nextButton || !carouselTrack || !indicators.length) return;
        
        let currentSlide = 0;
        const slideCount = indicators.length;
        let autoplayInterval;
        
        // Function to update carousel position
        function updateCarousel() {
            const transformValue = `translateX(-${currentSlide * 100}%)`;
            carouselTrack.style.transform = transformValue;
            carouselTrack.style.webkitTransform = transformValue;
            carouselTrack.style.msTransform = transformValue;
            
            // Update active indicator
            const activeIndicator = document.querySelector('.indicator.active');
            if (activeIndicator) activeIndicator.classList.remove('active');
            indicators[currentSlide].classList.add('active');
            
            // Update ARIA attributes for accessibility
            document.querySelectorAll('.testimonial-slide').forEach((slide, index) => {
                const isActive = index === currentSlide;
                slide.setAttribute('aria-hidden', !isActive);
                slide.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        }
        
        // Navigate to next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }
        
        // Navigate to previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel();
        }
        
        // Set up button event listeners
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetAutoplay();
            nextSlide();
        });
        
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetAutoplay();
            prevSlide();
        });
        
        // Set up indicator event listeners
        indicators.forEach(function(indicator, index) {
            indicator.addEventListener('click', function(e) {
                e.preventDefault();
                resetAutoplay();
                currentSlide = index;
                updateCarousel();
            });
        });
        
        // Touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (carouselTrack.parentElement) {
            carouselTrack.parentElement.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            carouselTrack.parentElement.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            resetAutoplay();
            if (touchEndX < touchStartX - 50) { // Threshold for swipe
                nextSlide();
            } else if (touchEndX > touchStartX + 50) {
                prevSlide();
            }
        }
        
        // Autoplay functionality
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }
        
        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
        
        // Initialize autoplay and first slide
        startAutoplay();
        updateCarousel();
        
        // Pause autoplay when user interacts with the page
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(autoplayInterval);
            } else {
                startAutoplay();
            }
        });
    }

    // Initialize Forms
    function initForms() {
        // Form submission handling with validation
        const forms = document.querySelectorAll('form');
        
        forms.forEach(function(form) {
            form.setAttribute('novalidate', true);
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm(form)) {
                    // For demo purposes - show success message
                    alert('Form submitted successfully!');
                    form.reset();
                }
            });
        });
        
        function validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(function(input) {
                // Clear previous error
                const errorElement = input.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
                
                // Validate required fields
                if (input.hasAttribute('required') && !input.value.trim()) {
                    showError(input, 'This field is required');
                    isValid = false;
                }
                
                // Validate email fields
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        showError(input, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
            });
            
            return isValid;
        }
        
        function showError(input, message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = '#e53e3e';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            
            input.parentNode.appendChild(errorElement);
            input.setAttribute('aria-invalid', 'true');
            input.focus();
        }
    }
})(); 