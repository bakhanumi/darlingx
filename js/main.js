/**
 * main.js
 * Main initialization and special effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add a loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loading-text">Initializing...</div>';
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after a delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1500);
    
    // Add glitch effect on click - but ONLY for specific interactive elements
    document.body.addEventListener('click', (e) => {
        const clickedElement = e.target.closest('a, button, .nav-link');
        if (clickedElement) {
            clickedElement.classList.add('glitch-effect');
            setTimeout(() => {
                clickedElement.classList.remove('glitch-effect');
            }, 150);
            e.stopPropagation();
        }
    });
    
    // Force reload if content looks broken
    if (!document.querySelector('.animate_letters')) {
        // Don't auto-reload, just show a warning in console
        console.warn('Animation elements missing.');
    }
    
    // Ensure text elements can be animated
    document.querySelectorAll('a, .navbar span, .about h1, .about-email, .about-location a, .about-text p, .socials a')
        .forEach(el => {
            if (!el.classList.contains('animate_letters') && el.innerText.trim() !== '') {
                const text = el.innerText;
                // Store original dimensions before replacing content
                const width = el.offsetWidth;
                const height = el.offsetHeight;
                
                el.innerHTML = `<span class="animate_letters">${text}</span>`;
                
                // Prevent layout shifts by maintaining original dimensions
                if (el.tagName === 'P') {
                    el.style.minHeight = height + 'px';
                }
            }
        });
    
    // Add parallax effect to matrix background elements
    function throttle(func, limit) {
        let inThrottle;
        return function(e) {
            if (!inThrottle) {
                func(e);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    document.addEventListener('mousemove', throttle((e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const matrixLines = document.querySelectorAll('.matrix-line');
        matrixLines.forEach(line => {
            const offsetX = (mouseX - 0.5) * 20;
            const offsetY = (mouseY - 0.5) * 10;
            line.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
        
        // Add subtle parallax to stars as well
        const stars = document.querySelectorAll('.star');
        const starsSample = Array.from(stars).slice(0, 10); // Only animate a subset for performance
        starsSample.forEach(star => {
            const offsetX = (mouseX - 0.5) * 5; // Reduce movement amount for subtle effect
            const offsetY = (mouseY - 0.5) * 5;
            
            // Get current position
            const currentTop = parseFloat(star.style.top) || 0;
            const currentLeft = parseFloat(star.style.left) || 0;
            
            // Apply subtle transform without changing base position
            star.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    }, 16)); // ~60fps
    
    // Execute an intro animation on the main heading when page loads
    setTimeout(() => {
        // Find and animate the name
        const nameElement = document.querySelector('.about-name .animate_letters');
        if (nameElement) {
            // Force animation by using the function from matrix-animation.js
            if (typeof animateText === 'function') {
                animateText(nameElement);
            } else {
                // Fallback if the function isn't available in this scope
                triggerNameAnimation(nameElement);
            }
        }
    }, 1500);
    
    // Fallback function to ensure name animates
    function triggerNameAnimation(element) {
        const originalText = element.getAttribute('data-original') || element.innerText;
        element.setAttribute('data-original', originalText);
        
        // Latin characters for the matrix effect
        const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?~`";
        
        let iteration = 0;
        const originalLength = originalText.length;
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
                })
                .join("");
            
            if (iteration >= originalLength) {
                clearInterval(interval);
            }
            
            iteration += 0.5;
        }, 30);
    }
    
    // Create special effect for name hover
    const nameElement = document.querySelector('.about-name');
    if (nameElement && window.constellationAnimation) {
        nameElement.addEventListener('mouseenter', function() {
            // Get the position of the name element
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Create a star explosion at this position
            if (typeof window.constellationAnimation.createStarExplosion === 'function') {
                window.constellationAnimation.createStarExplosion(centerX, centerY);
            }
        });
    }
    
    // Add loading hint
    function updateLoadingText() {
        const loadingTextElement = document.querySelector('.loading-text');
        if (loadingTextElement) {
            // Check if constellation animation is initializing
            setTimeout(() => {
                loadingTextElement.textContent = "Creating constellations...";
            }, 800);
        }
    }
    updateLoadingText();
});