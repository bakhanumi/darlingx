/**
 * cursor.js
 * Custom cursor effects and interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Only proceed if cursor elements exist
    if (!cursor || !cursorDot) return;
    
    // Enable custom cursor class on html element
    document.documentElement.classList.add('custom-cursor-enabled');
    
    // Track mouse position and update cursor elements
    document.addEventListener('mousemove', e => {
        // Add a slight delay to cursor for smooth effect
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
    });
    
    // Mouse down effect - shrink cursor
    document.addEventListener('mousedown', () => {
        cursor.style.width = '15px';
        cursor.style.height = '15px';
        cursor.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    });
    
    // Mouse up effect - restore cursor
    document.addEventListener('mouseup', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
    });
    
    // Special cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"], .animate_letters');
    
    interactiveElements.forEach(element => {
        // Hover effect - expand cursor
        element.addEventListener('mouseover', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.borderColor = 'var(--accent-color)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        
        // Mouse out - restore cursor
        element.addEventListener('mouseout', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--primary-color)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // Handle cursor visibility when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
});