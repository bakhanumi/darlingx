/**
 * matrix-animation.js
 * Adds matrix-style decoding animation to text elements on hover
 */

// Define animateText in the global scope so it can be called from other scripts
let animateText;

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Latin characters and symbols for the matrix effect
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?~`";
    
    // Apply animation to all text elements with links, исключая книжные элементы
    const allLinks = document.querySelectorAll('a:not(.book-link)');
    allLinks.forEach(link => {
        setupMatrixEffect(link);
    });
    
    // Apply animation to specific texts like name, navigation, etc.
    const animatedTexts = document.querySelectorAll('.animate_letters:not(.book-title):not(.book-author)');
    animatedTexts.forEach(element => {
        setupMatrixEffect(element);
    });
    
    // Setup the animation for a given element
    function setupMatrixEffect(element) {
        // Store original text for later use
        const originalText = element.innerText;
        element.setAttribute('data-original', originalText);
        
        // Set a fixed width to prevent layout shifts during animation
        if (element.tagName !== 'A' && !element.classList.contains('nav-link')) {
            element.style.display = 'inline-block';
            element.style.minWidth = element.offsetWidth + 'px';
        }
        
        // Add hover event listener
        element.addEventListener('mouseenter', function() {
            // Проверяем, не является ли элемент частью книжной карточки
            if (!element.closest('.book-card')) {
                animateText(this);
            }
        });
    }
    
    // The animation function
    animateText = function(element) {
        // Get original text
        const originalText = element.getAttribute('data-original') || element.innerText;
        
        // Store original text if not already stored
        if (!element.getAttribute('data-original')) {
            element.setAttribute('data-original', originalText);
        }
        
        // Clear any existing animation
        if (element.interval) {
            clearInterval(element.interval);
        }
        
        // New animation approach:
        // 1. First phase: Pure random characters for 1 second
        // 2. Second phase: Gradual reveal of original text
        
        let phase = 'random'; // Start with random phase
        let iteration = 0;
        const originalLength = originalText.length;
        const randomDuration = 400; // 1 second of pure random characters
        const startTime = Date.now();
        
        function step() {
            const currentTime = Date.now();
            
            // Check if we should switch to reveal phase
            if (phase === 'random' && currentTime - startTime > randomDuration) {
                phase = 'reveal';
                iteration = 0; // Reset iteration for the reveal phase
            }
            
            if (phase === 'random') {
                // Display only random characters during first phase
                element.innerText = originalText
                    .split("")
                    .map(letter => {
                        if (letter === ' ') return ' ';
                        // Добавляем больше случайных символов для более богатого эффекта
                        const randomChar = Math.random() > 0.5 
                            ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
                            : matrixChars[Math.floor(Math.random() * (matrixChars.length / 2))];
                        return randomChar;
                    })
                    .join("");
            } else {
                // Reveal phase: gradually show the original text
                element.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (letter === ' ') return ' ';
                        if (index < iteration) {
                            return originalText[index];
                        }
                        // Добавляем больше случайных символов для более богатого эффекта
                        const randomChar = Math.random() > 0.5 
                            ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
                            : matrixChars[Math.floor(Math.random() * (matrixChars.length / 2))];
                        return randomChar;
                    })
                    .join("");
                
                if (iteration >= originalLength) {
                    clearInterval(element.interval);
                }
                
                iteration += 0.25; // Уменьшаем шаг для более плавной анимации
            }
        }
        
        element.interval = setInterval(step, 25); // Уменьшаем интервал для большей частоты обновления
    };

    // Setup matrix effect for name
    function setupNameAnimation() {
        const nameElement = document.querySelector('.about-name .animate_letters');
        if (!nameElement) return;

        // Store original text
        const originalText = nameElement.innerText;
        nameElement.setAttribute('data-original', originalText);

        // Add hover event
        nameElement.addEventListener('mouseenter', () => {
            animateText(nameElement);
        });

        // Initial animation
        animateText(nameElement);
    }

    // Initialize name animation with a delay
    setTimeout(setupNameAnimation, 1000);

    // Remove unnecessary functions
    const animateAllTexts = null;
    const decodeText = null;
});