// Backend API Configuration
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Replace with your actual backend URL
const CONTACT_API_URL = `${API_BASE_URL}/posts`; // Example endpoint for contact form
const SKILLS_API_URL = `${API_BASE_URL}/users`; // Example endpoint for skills

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Mobile Menu Toggle
document.querySelector('.mobile-menu-button').addEventListener('click', () => {
    document.querySelector('.mobile-menu').classList.toggle('hidden');
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    submitText.textContent = 'Sending...';
    submitSpinner.style.display = 'block';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(CONTACT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                userId: 1 // Example user ID
            })
        });
        
        if (response.ok) {
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitText.textContent = 'Send Message';
        submitSpinner.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Load Skills from Backend
async function loadSkills() {
    try {
        const response = await fetch(SKILLS_API_URL);
        const skillsData = await response.json();
        
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';
        
        // Example skills data - replace with your actual skills structure
        const skills = [
            { name: 'React', icon: 'fab fa-react', color: 'text-blue-500' },
            { name: 'Node.js', icon: 'fab fa-node-js', color: 'text-green-500' },
            { name: 'JavaScript', icon: 'fab fa-js-square', color: 'text-yellow-500' },
            { name: 'Python', icon: 'fab fa-python', color: 'text-blue-600' },
            { name: 'HTML5', icon: 'fab fa-html5', color: 'text-orange-500' },
            { name: 'CSS3', icon: 'fab fa-css3-alt', color: 'text-blue-400' },
            { name: 'MySQL', icon: 'fas fa-database', color: 'text-blue-700' },
            { name: 'Power BI', icon: 'fas fa-chart-bar', color: 'text-yellow-600' }
        ];
        
        skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-card';
            skillElement.innerHTML = `
                <i class="${skill.icon} ${skill.color} skill-icon"></i>
                <h3 class="skill-name">${skill.name}</h3>
            `;
            skillsContainer.appendChild(skillElement);
        });
        
    } catch (error) {
        console.error('Error loading skills:', error);
        showToast('Failed to load skills', 'error');
    }
}

// Form validation
function validateForm() {
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// Add scroll animation
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// API Health Check
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/1`);
        if (response.ok) {
            console.log('API connection successful');
        }
    } catch (error) {
        console.warn('API connection failed:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    initScrollAnimation();
    checkApiHealth();
    
    // Add event listener to mobile menu links
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.mobile-menu').classList.add('hidden');
        });
    });
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('hidden')) {
                fallback.style.display = 'flex';
            }
        });
    });
});
