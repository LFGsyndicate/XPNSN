// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const elementsWithData = document.querySelectorAll('[data-ru], [data-en]');
    
    // Language switching
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetLang = this.getAttribute('data-lang');
            
            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update content
            elementsWithData.forEach(element => {
                const newText = element.getAttribute(`data-${targetLang}`);
                if (newText) {
                    element.textContent = newText;
                }
            });
            
            // Update HTML lang attribute
            document.documentElement.lang = targetLang;
            
            // Дополнительно обновляем футер и бизнес-блоки
            document.querySelectorAll('.footer [data-ru], .footer [data-en], .business-section [data-ru], .business-section [data-en]').forEach(element => {
                const newText = element.getAttribute(`data-${targetLang}`);
                if (newText) {
                    element.textContent = newText;
                }
            });
        });
    });
    
    // Удаляем анимации появления блоков и любые IntersectionObserver для анимаций
    // Оставляем только плавное появление без translateY и opacity
    const blocks = document.querySelectorAll('.infographic-block');
    blocks.forEach(block => {
        block.style.opacity = '1';
        block.style.transform = 'none';
    });

    // Отключаем все функции animateIntersections, animateTrafficLights, animateAgentNodes, animateWarehouseZones
    // и второй blockObserver
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) hero.style.transform = 'none';
    });
    
    // Smooth scrolling for navigation
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
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.result-card, .metric, .message');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Animate metrics on scroll
    const metricsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metricValue = entry.target.querySelector('.metric-value');
                if (metricValue) {
                    const finalValue = metricValue.textContent;
                    const numericValue = parseInt(finalValue.replace('%', ''));
                    
                    let currentValue = 0;
                    const increment = numericValue / 50;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            currentValue = numericValue;
                            clearInterval(timer);
                        }
                        metricValue.textContent = `${Math.floor(currentValue)}%`;
                    }, 20);
                }
            }
        });
    }, { threshold: 0.5 });
    
    const metrics = document.querySelectorAll('.metric');
    metrics.forEach(metric => {
        metricsObserver.observe(metric);
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        document.querySelectorAll('.infographic-block').forEach(block => {
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
        });
    });
    
    // Add CSS for loading state
    const style = document.createElement('style');
    style.textContent = `
        body:not(.loaded) {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
        
        .infographic-block {
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .result-card, .metric, .message {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === '1' || e.key === '2' || e.key === '3') {
            const blockNumber = parseInt(e.key);
            const targetBlock = document.querySelector(`.block-${blockNumber}`);
            if (targetBlock) {
                targetBlock.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Language switching with keyboard
        if (e.key === 'r' || e.key === 'R') {
            document.querySelector('[data-lang="ru"]').click();
        }
        if (e.key === 'e' || e.key === 'E') {
            document.querySelector('[data-lang="en"]').click();
        }
    });
    
    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next block
                const currentBlock = getCurrentVisibleBlock();
                if (currentBlock < 3) {
                    document.querySelector(`.block-${currentBlock + 1}`).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                // Swipe right - previous block
                const currentBlock = getCurrentVisibleBlock();
                if (currentBlock > 1) {
                    document.querySelector(`.block-${currentBlock - 1}`).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    }
    
    function getCurrentVisibleBlock() {
        const blocks = document.querySelectorAll('.infographic-block');
        for (let i = 0; i < blocks.length; i++) {
            const rect = blocks[i].getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                return i + 1;
            }
        }
        return 1;
    }
    
    // Add accessibility features
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.setAttribute('aria-label', `Switch to ${button.getAttribute('data-lang').toUpperCase()} language`);
    });
    
    // Add focus indicators
    document.querySelectorAll('button, .result-card, .metric').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Auto-detect language on page load
    window.addEventListener('DOMContentLoaded', function () {
        var userLang = navigator.language || navigator.userLanguage;
        var lang = userLang && userLang.toLowerCase().startsWith('ru') ? 'ru' : 'en';
        setLanguage(lang);
    });
    
    function setLanguage(lang) {
        // Switch active button
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        // Update all elements with data-ru/data-en
        document.querySelectorAll('[data-ru][data-en]').forEach(function(el) {
            el.textContent = el.getAttribute('data-' + lang);
        });
        // Update all elements with data-ru (for lists, etc.)
        document.querySelectorAll('[data-ru]').forEach(function(el) {
            if (el.hasAttribute('data-' + lang)) {
                el.textContent = el.getAttribute('data-' + lang);
            }
        });
    }
    
    // Language switcher click
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});