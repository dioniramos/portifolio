// ================================
// CONFIGURAÇÕES GLOBAIS
// ================================

// Configuração do Intersection Observer para performance
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

// Debounce function para otimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================
// NAVEGAÇÃO E MENU
// ================================

function toggleMenu() {
    const nav = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    nav.classList.toggle('active');
    
    // Adiciona animação ao ícone do menu
    if (nav.classList.contains('active')) {
        menuToggle.innerHTML = '✕'; // X para fechar
        menuToggle.setAttribute('aria-label', 'Fechar menu');
    } else {
        menuToggle.innerHTML = '☰'; // Hambúrguer para abrir
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
}

// Fecha o menu ao clicar em um link
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#navbar a').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('navbar');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
    });
});

// Fecha menu ao clicar fora dele
document.addEventListener('click', function(event) {
    const nav = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Abrir menu');
        }
    }
});

// ================================
// SMOOTH SCROLLING E NAVEGAÇÃO ATIVA
// ================================

// Highlight da seção ativa na navegação
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('#navbar a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && 
            window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Otimizado com debounce
const debouncedUpdateNav = debounce(updateActiveNavLink, 100);
window.addEventListener('scroll', debouncedUpdateNav);

// ================================
// FORMULÁRIOS E EMAILJS
// ================================

// Melhor tratamento do formulário de contato
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            
            // Mostra loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Inicializa EmailJS
            emailjs.init('XdMX4UNam9_CcIkzJ');
            
            emailjs.sendForm('service_4tw0k87', 'template_hq0zmhj', this)
                .then(function () {
                    showNotification('Mensagem enviada com sucesso!', 'success');
                    contactForm.reset();
                }, function (error) {
                    console.error('Erro EmailJS:', error);
                    showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});

// ================================
// SISTEMA DE NOTIFICAÇÕES
// ================================

function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Adiciona estilos inline caso não existam no CSS
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Define cores baseadas no tipo
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ================================
// CLIPBOARD FUNCIONALIDADE
// ================================

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Elemento não encontrado:', elementId);
        return;
    }
    
    const text = element.textContent || element.innerText;
    
    // Método moderno (Clipboard API)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Texto copiado!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback para navegadores mais antigos
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Texto copiado!', 'success');
        } else {
            showNotification('Erro ao copiar texto', 'error');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotification('Erro ao copiar texto', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ================================
// LAZY LOADING OTIMIZADO
// ================================

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Cria nova imagem para pré-carregamento
                    const newImg = new Image();
                    
                    newImg.onload = function() {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    };
                    
                    newImg.onerror = function() {
                        console.error('Erro ao carregar imagem:', img.dataset.src);
                        img.classList.add('error');
                    };
                    
                    newImg.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        }, observerOptions);

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores sem IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ================================
// ANIMAÇÕES E EFEITOS VISUAIS
// ================================

// Animação de entrada para elementos
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => animationObserver.observe(el));
}

// Parallax suave para hero section
function initParallax() {
    const heroSection = document.querySelector('#sobre');
    
    if (heroSection) {
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroSection.style.transform = `translateY(${rate}px)`;
        }, 10));
    }
}

// ================================
// ANALYTICS E TRACKING
// ================================

// Tracking de eventos customizados
function trackEvent(action, category, label, value = null) {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Microsoft Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', `${category}_${action}`, { label: label });
        }
        
        console.log('Event tracked:', { action, category, label, value });
    } catch (error) {
        console.warn('Tracking error:', error);
    }
}

// Auto-tracking de interações importantes
function setupAutoTracking() {
    // Tracking de cliques em projetos do portfólio
    document.querySelectorAll('.portfolio-link').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('click', 'portfolio', 'project_view');
        });
    });
    
    // Tracking de redes sociais
    document.querySelectorAll('.author-social a').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('img')?.alt || 'unknown';
            trackEvent('click', 'social', platform);
        });
    });
    
    // Tracking de newsletter signup (Substack)
    const newsletterIframe = document.querySelector('iframe[src*="substack"]');
    if (newsletterIframe) {
        newsletterIframe.addEventListener('load', () => {
            trackEvent('view', 'newsletter', 'substack_form');
        });
    }
    
    // Tracking de tempo na página
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('engagement', 'time_on_page', 'seconds', timeSpent);
    });
    
    // Tracking de scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (scrollPercent >= 25 && scrollPercent < 50) {
                trackEvent('scroll', 'depth', '25_percent');
            } else if (scrollPercent >= 50 && scrollPercent < 75) {
                trackEvent('scroll', 'depth', '50_percent');
            } else if (scrollPercent >= 75) {
                trackEvent('scroll', 'depth', '75_percent');
            }
        }
    }, 250));
}

// ================================
// PERFORMANCE E OTIMIZAÇÕES
// ================================

// Pré-carregamento de recursos críticos
function preloadCriticalResources() {
    const criticalImages = [
        'src/images/author-photo.jpg',
        'src/images/ebook-removebg-preview.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Otimização de fonts
function optimizeFonts() {
    // Adiciona font-display: swap às fontes
    const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (fontLink && !fontLink.href.includes('display=swap')) {
        fontLink.href += '&display=swap';
    }
}

// ================================
// CSS DINÂMICO
// ================================

// CSS para lazy loading e animações
const dynamicCSS = `
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
        background: #f0f0f0;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
    
    .lazy.error {
        opacity: 0.5;
        background: #ffebee;
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    /* Melhorias de performance */
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
    }
    
    /* Otimizações para dispositivos móveis */
    @media (max-width: 768px) {
        .parallax-element {
            transform: none !important;
        }
    }
`;

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Adiciona CSS dinâmico
    const style = document.createElement('style');
    style.textContent = dynamicCSS;
    document.head.appendChild(style);
    
    // Inicializa funcionalidades
    preloadCriticalResources();
    optimizeFonts();
    lazyLoadImages();
    animateOnScroll();
    initParallax();
    setupAutoTracking();
    
    // Adiciona classes para animação
    document.querySelectorAll('.portfolio-item, .blog-post, .case-study').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    console.log('🚀 Portfolio JavaScript carregado com sucesso!');
});

// ================================
// SERVICE WORKER (OPCIONAL)
// ================================

// Registra service worker para cache (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed:', registrationError);
            });
    });
}

// ================================
// EXPORTS (PARA TESTES)
// ================================

// Para testes unitários, se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMenu,
        copyToClipboard,
        trackEvent,
        showNotification
    };
}
