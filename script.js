// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
}));

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.product-card, .infra-card, .nutrition-card, .stat-card, .solution-card, .trust-card, .step, .section-header, .objective-card, .contact-card, .value-item, .hero-content, .hero-logo-overlay, .testimonial-card, .certificate-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});


// Contact form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelector('input[type="text"]:nth-of-type(2)').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();
    });
}

// Scroll to Top Button Logic
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn?.classList.add('show');
    } else {
        scrollTopBtn?.classList.remove('show');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll to top functionality
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    
    // Use the CSS variables defined in :root
    const primary = 'linear-gradient(135deg, #f37d35 0%, #cc5e1b 100%)';
    
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: ${primary};
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 10px 30px rgba(243, 125, 53, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
        scrollBtn.style.boxShadow = '0 15px 35px rgba(243, 125, 53, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
        scrollBtn.style.boxShadow = '0 10px 30px rgba(243, 125, 53, 0.3)';
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// Lazy loading for images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    // PREVENT TRACKING DURING DEVELOPMENT/TESTING
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.search.includes('debug=true');

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Add a delay before starting the typing effect
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }

    // LEVEL 2: Business Tracking (Button Click Tracking)
    // Wrap tracking in a helper to manage environment
    function trackEvent(name, params) {
        if (isDevelopment) {
            console.log(`[Analytics Debug] Event: ${name}`, params);
            return;
        }
        if (typeof gtag === 'function') {
            gtag('event', name, params);
        }
    }

    // 1. WhatsApp Button Tracking
    const whatsappBtn = document.querySelector('.whatsapp-sticky');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            trackEvent('whatsapp_click', {
                'event_category': 'Engagement',
                'event_label': 'Order Now on WhatsApp',
                'transport_type': 'beacon'
            });
        });
    }

    // 2. Order/Buy Now Button Tracking (Targeting primary CTA buttons)
    const orderButtons = document.querySelectorAll('.btn-primary, .hero-buttons .btn, [href*="wa.me"]');
    orderButtons.forEach(btn => {
        // Skip the sticky WhatsApp button as it's handled above
        if (btn.classList.contains('whatsapp-sticky')) return;

        btn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('order_intent_click', {
                'event_category': 'Conversion',
                'event_label': buttonText,
                'button_type': 'Primary CTA',
                'transport_type': 'beacon'
            });
        });
    });

    // 3. Contact Form Submission Tracking
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('form_submission', {
                'event_category': 'Engagement',
                'event_label': 'Contact Form',
                'transport_type': 'beacon'
            });
        });
    }

    // 4. Click-to-Call and Click-to-Email Tracking
    const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const type = this.href.startsWith('tel:') ? 'Phone' : 'Email';
            trackEvent('contact_lead_click', {
                'event_category': 'Leads',
                'event_label': type,
                'value': this.href,
                'transport_type': 'beacon'
            });
        });
    });

    // 5. Scroll Depth Tracking
    let scrollDepths = [25, 50, 75, 100];
    let trackedDepths = new Set();

    window.addEventListener('scroll', () => {
        const h = document.documentElement, 
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';
        const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;

        scrollDepths.forEach(depth => {
            if (percent >= depth && !trackedDepths.has(depth)) {
                trackedDepths.add(depth);
                trackEvent('scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': `Reached ${depth}%`,
                    'value': depth,
                    'non_interaction': true
                });
            }
        });
    }, { passive: true });
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const numericTarget = parseInt(target.replace(/\D/g, ''));
        
        let current = 0;
        const increment = numericTarget / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
                current = numericTarget;
                clearInterval(timer);
            }
            
            if (isPercentage) {
                counter.textContent = Math.floor(current) + '%';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.story-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('loading')) return;
        
        // Don't add loading state to navigation buttons
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
            return;
        }
        
        this.classList.add('loading');
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        
        // Remove loading state after 2 seconds (simulate action)
        setTimeout(() => {
            this.classList.remove('loading');
            this.textContent = originalText;
        }, 2000);
    });
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    .btn.loading {
        opacity: 0.7;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: var(--text-muted);
        border-radius: 50%;
        animation: typingAnimation 1.4s infinite ease-in-out both;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typingAnimation {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });
}

if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });
}

const chatbotResponses = {
    'hi': 'Hi there! Welcome to Amroth Nutrition. How can I assist you today?',
    'hello': 'Hello! Welcome to Amroth Nutrition. What would you like to know about?',
    'hey': 'Hey! How can I help you with Amroth products today?',
    'amroth': 'Amroth Nutrition offers 100% natural, preservative-free instant healthy food products including multigrain mixes, sambar mix, vegetable & fruit powders, and microgreens.',
    'products': 'We offer 5 amazing products: Multigrain Energy Mix, Instant Sambar Mix, Vegetable Powders, Fruit Powders, and Fresh Microgreens.',
    'product': 'We offer 5 amazing products: Multigrain Energy Mix, Instant Sambar Mix, Vegetable Powders, Fruit Powders, and Fresh Microgreens.',
    'price': 'For pricing details, please contact us via WhatsApp or email. We\'ll be happy to assist you!',
    'cost': 'For cost details, please contact us via WhatsApp or email. We\'ll be happy to assist you!',
    'order': 'Great! You can order by clicking on the "Order Now" button or via WhatsApp at +91 8106350955.',
    'how to order': 'You can order by clicking on the "Order Now" button or via WhatsApp at +91 8106350955.',
    'buy': 'You can buy our products by clicking on the "Order Now" button or via WhatsApp at +91 8106350955.',
    'purchase': 'To purchase Amroth products, click on the "Order Now" button or contact us via WhatsApp at +91 8106350955.',
    'contact': 'You can reach us at: Phone: +91 7702741798, Email: amrothproducts@gmail.com',
    'email': 'You can email us at amrothproducts@gmail.com',
    'phone': 'You can call us at +91 7702741798',
    'whatsapp': 'You can reach us on WhatsApp at +91 8106350955',
    'location': 'We are located in Takkellapadu Village, Amaravathi District, Andhra Pradesh.',
    'address': 'Our address is Takkellapadu Village, Amaravathi District, Andhra Pradesh.',
    'ingredients': 'All our products are made with 100% natural ingredients with no preservatives or artificial additives.',
    'natural': 'Yes! All Amroth products are 100% natural with no preservatives, artificial colors, or chemicals.',
    'preservatives': 'No! All our products are 100% natural with no preservatives, artificial colors, or chemicals.',
    'additives': 'No! We don\'t use any artificial additives or preservatives in our products.',
    'shipping': 'For shipping information, please contact us via WhatsApp or email.',
    'delivery': 'For delivery information, please contact us via WhatsApp or email.',
    'multigrain': 'Our Multigrain Energy Mix is made with 25+ natural ingredients including cereals, pulses, millets, nuts, and seeds.',
    'sambar': 'Our Instant Sambar Mix is made with dehydrated vegetables and roasted spices for authentic taste in minutes.',
    'vegetable': 'Our Vegetable Powders are pure dehydrated vegetables for daily nutrition.',
    'fruit': 'Our Fruit Powders are natural fruit goodness in easy-to-use powder form.',
    'microgreens': 'Our Fresh Microgreens are living superfoods for maximum nutrient density.',
    'thanks': 'You\'re welcome! Is there anything else I can help you with?',
    'thank you': 'You\'re welcome! Is there anything else I can assist you with?',
    'ok': 'Great! Is there anything else you\'d like to know about Amroth?',
    'okay': 'Perfect! Let me know if you need any other information about our products.',
    'default': 'I\'m here to help! You can ask me about Amroth, our products, ingredients, ordering, pricing, or contact information.',
};

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(chatbotResponses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    return chatbotResponses.default;
}

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-leaf"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    content.appendChild(paragraph);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-leaf"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    chatbotInput.value = '';
    
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const botResponse = getBotResponse(message);
        addMessage(botResponse, false);
    }, 1000);
}

if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

const quickReplies = document.querySelectorAll('.quick-reply-btn');
quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        chatbotInput.value = message;
        sendMessage();
    });
});

// Amroth Form Submission to n8n Webhook
const amrothForm = document.getElementById('amrothForm');
if (amrothForm) {
    amrothForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const data = Object.fromEntries(new FormData(form));
        
        console.log('Form data to send:', data);
        console.log('Webhook URL:', 'https://n8n.amroth.life/webhook/fb5af8a0-2551-4c0f-a992-9258a1d9ec4c');
        
        try {
            const res = await fetch('https://n8n.amroth.life/webhook/fb5af8a0-2551-4c0f-a992-9258a1d9ec4c', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('Response status:', res.status, res.statusText);
            const responseText = await res.text();
            console.log('Response body:', responseText);
            
            if (res.ok) {
                showNotification('Thank you! We will contact you soon.', 'success');
                form.reset();
            } else {
                showNotification('Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error details:', error);
            showNotification('Network error. Please try again.', 'error');
        }
    });
}

console.log('Ikshwaaks Nutrition website loaded successfully!');
