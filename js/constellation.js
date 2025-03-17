/**
 * constellation.js
 * Premium star constellation background animation that integrates with the cyberpunk/matrix theme
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration for the constellation animation
    const constellationConfig = {
        starCount: 30,          // Total number of stars
        minSize: 1,            // Minimum star size in px
        maxSize: 3,            // Maximum star size in px
        transitionSpeed: 5000,   // Speed for transitions (5 seconds)
        constellationDuration: 12000, // Change every 12 seconds
        fadeInDuration: 2000,     // Duration for stars to fade in
        premiumStarCount: 10,   // Количество премиум-звезд
        maxConnections: 3,        // Максимальное количество соединений для одной звезды
        connectionDistance: 150,  // Максимальное расстояние для соединения звезд
        connectionOpacity: 0.3    // Прозрачность линий соединения
    };

    // Predefined star positions for smooth transitions
    const starPositions = [
        // Группа 1 - Треугольник
        [
            {top: 20, left: 20}, {top: 40, left: 40}, {top: 20, left: 60},
            {top: 30, left: 30}, {top: 35, left: 45}, {top: 25, left: 50}
        ],
        // Группа 2 - Квадрат
        [
            {top: 20, left: 20}, {top: 20, left: 60},
            {top: 60, left: 20}, {top: 60, left: 60},
            {top: 40, left: 40}, {top: 30, left: 30}
        ],
        // Группа 3 - Круг
        [
            {top: 40, left: 20}, {top: 20, left: 40},
            {top: 40, left: 60}, {top: 60, left: 40},
            {top: 40, left: 40}, {top: 30, left: 30}
        ],
        // Группа 4 - Зигзаг
        [
            {top: 20, left: 20}, {top: 30, left: 30},
            {top: 40, left: 20}, {top: 50, left: 30},
            {top: 60, left: 20}, {top: 35, left: 45}
        ]
    ];

    let currentPattern = 0;
    let animationEnabled = true;
    let animationTimer;
    let isLowPowerDevice = false;

    // Check system capabilities
    function checkSystemCapabilities() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasLowCPU = window.navigator.hardwareConcurrency && window.navigator.hardwareConcurrency < 4;
        isLowPowerDevice = isMobile || hasLowCPU;
        
        if (isLowPowerDevice) {
            constellationConfig.starCount = 20;
            constellationConfig.constellationDuration = 15000;
        }
    }

    // Initialize the constellation background
    function initConstellationBackground() {
        checkSystemCapabilities();
        
        const container = document.querySelector('.constellation-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create stars
        for (let i = 0; i < constellationConfig.starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const isPremium = i < constellationConfig.premiumStarCount;
            if (isPremium) {
                star.classList.add('premium-star');
            }
            
            const size = constellationConfig.minSize + Math.random() * (constellationConfig.maxSize - constellationConfig.minSize);
            if (size < 2.5) {
                star.classList.add('size-small');
            } else if (size < 3.5) {
                star.classList.add('size-medium');
            } else {
                star.classList.add('size-large');
            }
            
            const randomDelay = Math.random() * 4;
            const randomDuration = 3 + Math.random() * 2;
            
            Object.assign(star.style, {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                '--twinkle-delay': `${randomDelay}s`,
                '--twinkle-duration': `${randomDuration}s`,
                transition: `all ${constellationConfig.transitionSpeed}ms cubic-bezier(0.4, 0, 0.6, 1)`
            });
            
            container.appendChild(star);
        }
        
        // Start the animation cycle
        setTimeout(() => {
            changeStarPositions();
            animationTimer = setInterval(changeStarPositions, constellationConfig.constellationDuration);
        }, constellationConfig.fadeInDuration);

        // Добавляем настройку интерактивности
        setupStarInteractions();
    }

    // Change star positions
    function changeStarPositions() {
        const container = document.querySelector('.constellation-container');
        if (!container) return;
        
        const stars = Array.from(container.querySelectorAll('.star'));
        const pattern = starPositions[currentPattern];
        
        stars.forEach((star, index) => {
            const randomOffset = () => (Math.random() - 0.5) * 5;
            
            if (pattern && index < pattern.length) {
                Object.assign(star.style, {
                    top: `${pattern[index].top + randomOffset()}%`,
                    left: `${pattern[index].left + randomOffset()}%`,
                    transition: `all ${constellationConfig.transitionSpeed}ms cubic-bezier(0.4, 0, 0.6, 1)`
                });
            } else {
                Object.assign(star.style, {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transition: `all ${constellationConfig.transitionSpeed}ms cubic-bezier(0.4, 0, 0.6, 1)`
                });
            }
        });
        
        currentPattern = (currentPattern + 1) % starPositions.length;

        // Обновляем интерактивность после изменения позиций
        setupStarInteractions();
    }

    // Toggle animation state
    function toggleAnimation(enable) {
        animationEnabled = enable;
        
        const container = document.querySelector('.constellation-container');
        if (!container) return;
        
        if (!enable) {
            container.querySelectorAll('.star').forEach(el => {
                el.style.animationPlayState = 'paused';
                el.style.transition = 'none';
            });
            clearInterval(animationTimer);
        } else {
            container.querySelectorAll('.star').forEach(el => {
                el.style.animationPlayState = 'running';
                el.style.transition = '';
            });
            
            changeStarPositions();
            animationTimer = setInterval(changeStarPositions, constellationConfig.constellationDuration);
        }
    }

    // Special effect: Create star explosion
    function createStarExplosion(x, y) {
        const container = document.querySelector('.constellation-container');
        if (!container || isLowPowerDevice) return;
        
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'star size-small';
            
            Object.assign(particle.style, {
                top: `${y}px`,
                left: `${x}px`,
                position: 'absolute',
                width: '2px',
                height: '2px',
                transition: 'all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)'
            });
            
            container.appendChild(particle);
            
            setTimeout(() => {
                const angle = (i / particleCount) * Math.PI * 2;
                const distance = 50 + Math.random() * 50;
                const newX = x + Math.cos(angle) * distance;
                const newY = y + Math.sin(angle) * distance;
                
                Object.assign(particle.style, {
                    top: `${newY}px`,
                    left: `${newX}px`,
                    opacity: '0'
                });
                
                setTimeout(() => particle.remove(), 800);
            }, 10);
        }
    }

    // Добавляем новую функцию для создания соединений между звездами
    function createStarConnections(star) {
        const container = document.querySelector('.constellation-container');
        const stars = Array.from(container.querySelectorAll('.star'));
        const starRect = star.getBoundingClientRect();
        const starCenter = {
            x: starRect.left + starRect.width / 2,
            y: starRect.top + starRect.height / 2
        };

        // Удаляем старые соединения
        container.querySelectorAll('.constellation-line').forEach(line => line.remove());

        // Находим ближайшие звезды
        const nearbyStars = stars
            .filter(s => s !== star)
            .map(s => {
                const rect = s.getBoundingClientRect();
                const center = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                const distance = Math.hypot(center.x - starCenter.x, center.y - starCenter.y);
                return { star: s, distance, center };
            })
            .filter(s => s.distance < constellationConfig.connectionDistance)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, constellationConfig.maxConnections);

        // Создаем соединения
        nearbyStars.forEach(({ star: targetStar, center: targetCenter }) => {
            const line = document.createElement('div');
            line.className = 'constellation-line';
            
            // Вычисляем параметры линии
            const angle = Math.atan2(targetCenter.y - starCenter.y, targetCenter.x - starCenter.x);
            const length = Math.hypot(targetCenter.x - starCenter.x, targetCenter.y - starCenter.y);
            
            // Применяем стили
            Object.assign(line.style, {
                width: `${length}px`,
                transform: `translate(${starCenter.x}px, ${starCenter.y}px) rotate(${angle}rad)`,
                opacity: constellationConfig.connectionOpacity
            });
            
            container.appendChild(line);
            
            // Добавляем класс для анимации
            targetStar.classList.add('connecting');
            setTimeout(() => targetStar.classList.remove('connecting'), 1200);
        });
    }

    // Обновляем обработчики событий для звезд
    function setupStarInteractions() {
        const container = document.querySelector('.constellation-container');
        const stars = container.querySelectorAll('.star');

        stars.forEach(star => {
            // Добавляем интерактивность при наведении
            star.addEventListener('mouseenter', () => {
                if (!isLowPowerDevice) {
                    createStarConnections(star);
                }
            });

            // Добавляем эффект клика
            star.addEventListener('click', (e) => {
                if (!isLowPowerDevice) {
                    createStarExplosion(e.clientX, e.clientY);
                    star.style.transform = 'scale(2.5) rotate(180deg)';
                    setTimeout(() => {
                        star.style.transform = '';
                    }, 1000);
                }
            });
        });
    }

    // Initialize
    initConstellationBackground();
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        toggleAnimation(false);
    }
    
    // Event Listeners
    let lastClickTime = 0;
    document.addEventListener('click', function(e) {
        const now = Date.now();
        if (animationEnabled && now - lastClickTime > 300) {
            lastClickTime = now;
            createStarExplosion(e.clientX, e.clientY);
        }
    });
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        if (animationEnabled) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(changeStarPositions, 250);
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        toggleAnimation(!document.hidden);
    });

    // Make functionality available globally
    window.constellationAnimation = {
        init: initConstellationBackground,
        toggle: toggleAnimation,
        change: changeStarPositions,
        createStarExplosion: createStarExplosion
    };
}); 