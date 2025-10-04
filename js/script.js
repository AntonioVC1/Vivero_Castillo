// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL MENÚ MÓVIL (HAMBURGUESA) ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenuContainer = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');
    const overlay = document.querySelector('.overlay');

    if (menuToggle && navMenuContainer) {
        // Abrir menú
        menuToggle.addEventListener('click', () => {
            navMenuContainer.classList.add('active');
            overlay.classList.add('active');
        });

        // Función para cerrar el menú
        const closeMenu = () => {
            navMenuContainer.classList.remove('active');
            overlay.classList.remove('active');
        };

        // Cerrar con el botón "X" o el overlay
        navClose.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    // --- LÓGICA PARA RESALTAR EL ENLACE ACTIVO (MÉTODO SIMPLIFICADO Y ROBUSTO) ---
    const currentUrl = window.location.href;
    const allNavLinks = document.querySelectorAll('.nav-link');

    allNavLinks.forEach(link => {
        // Comparamos la URL completa del enlace con la URL actual de la página
        if (link.href === currentUrl) {
            link.classList.add('active-link');
        }
    });

    // --- LÓGICA PARA EL SCROLL SUAVE (SMOOTH SCROLL) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // --- LÓGICA PARA CAMBIAR EL FONDO DE LA BARRA DE NAVEGACIÓN AL HACER SCROLL ---
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.backdropFilter = 'blur(5px)';
            } else {
                nav.style.background = 'var(--blanco)';
                nav.style.backdropFilter = 'none';
            }
        });
    }

    // ===================================================================
    // --- LÓGICA PARA EL CARRUSEL PROMOCIONAL (VERSIÓN INFINITA) ---
    // ===================================================================
    const promoCarousel = document.querySelector('.promo-carousel');
    if(promoCarousel) {
        const prevButton = promoCarousel.parentElement.querySelector('.carousel-button.prev');
        const nextButton = promoCarousel.parentElement.querySelector('.carousel-button.next');
        
        const scrollCarousel = () => {
            const cardWidth = promoCarousel.querySelector('.carousel-card').offsetWidth + 20; // Ancho de la tarjeta + gap
            const scrollEnd = promoCarousel.scrollWidth - promoCarousel.clientWidth;

            // Lógica para el botón "Siguiente"
            nextButton.addEventListener('click', () => {
                // Si estamos cerca del final, vamos al principio
                if (promoCarousel.scrollLeft >= scrollEnd - 1) {
                    promoCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    promoCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            });

            // Lógica para el botón "Anterior"
            prevButton.addEventListener('click', () => {
                // Si estamos en el principio, vamos al final
                if (promoCarousel.scrollLeft === 0) {
                    promoCarousel.scrollTo({ left: scrollEnd, behavior: 'smooth' });
                } else {
                    promoCarousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                }
            });
        };

        // Esperamos a que las imágenes carguen para que el cálculo del ancho sea correcto
        window.addEventListener('load', scrollCarousel);
    }
    // ===================================================================
    // --- LÓGICA PARA EL CARRUSEL DE PÓSTERES EN PÁGINA DE EVENTOS ---
    // ===================================================================
    const posterCarousel = document.querySelector('.poster-carousel');
    if(posterCarousel) {
        const container = posterCarousel.parentElement;
        const prevButton = container.querySelector('.carousel-button.prev');
        const nextButton = container.querySelector('.carousel-button.next');
        
        // Funcionalidad de los botones
        nextButton.addEventListener('click', () => {
            const cardWidth = posterCarousel.querySelector('.poster-card').offsetWidth + 20;
            posterCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', () => {
            const cardWidth = posterCarousel.querySelector('.poster-card').offsetWidth + 20;
            posterCarousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        // Funcionalidad de expandir imagen (Lightbox)
        const modal = document.getElementById('imageModal');
        if (modal) {
            const modalImg = document.getElementById("modalImage");
            const posterCards = container.querySelectorAll('.poster-card');

            posterCards.forEach(card => {
                card.addEventListener('click', function() {
                    const imgSrc = this.querySelector('img').src;
                    modal.classList.add('active');
                    modalImg.src = imgSrc;
                    document.body.style.overflow = 'hidden';
                });
            });
        }
    }
    
    // ===================================================================
    // --- LÓGICA PARA EL MODAL DE IMÁGENES (LIGHTBOX) ---
    // ===================================================================
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImg = document.getElementById("modalImage");
        const closeBtn = document.querySelector(".modal-close");
        const carouselCards = document.querySelectorAll('.carousel-card');

        // Asignamos un evento de clic a cada tarjeta del carrusel
        carouselCards.forEach(card => {
            card.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                modal.classList.add('active');
                modalImg.src = imgSrc;
                document.body.style.overflow = 'hidden'; // Evita que la página haga scroll
            });
        });

        // Función para cerrar el modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restaura el scroll
        }

        // Clic en el botón "X"
        closeBtn.addEventListener('click', closeModal);

        // Clic fuera de la imagen (en el fondo oscuro)
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    // ===================================================================
    // --- LÓGICA CORREGIDA PARA EL FORMULARIO DE CONTACTO ---
    // ===================================================================
    const contactForm = document.getElementById('contactForm');
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    // --- DATOS DE CONTACTO ---
    const recipientEmail = 'viverocastillo0@gmail.com';
    const whatsappNumber = '522218919841'; // Sin el "+"

    // Función para construir el mensaje final basado en los campos llenos
    function buildMessageBody(name, email, message) {
        if (name && email) {
            return `Hola buen día, soy ${name} (${email}).\n\nMi mensaje es: ${message}`;
        } else if (name) {
            return `Hola buen día, soy ${name}.\n\nMi mensaje es: ${message}`;
        } else {
            return message;
        }
    }

    if (contactForm) {
        // Evento para el botón de Enviar por Correo
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const message = document.getElementById('message').value.trim();
            
            // --- NUEVA VALIDACIÓN ---
            if (!message) {
                alert('Por favor, escribe un mensaje para continuar.');
                return; // Detiene la ejecución si el mensaje está vacío
            }

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const finalBody = buildMessageBody(name, email, message);
            const subject = `Mensaje desde la web de Vivero Castillo`;

            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(finalBody)}`;
            window.location.href = mailtoLink;
        });
    }

    if (whatsappBtn) {
        // Evento para el botón de Enviar por WhatsApp
        whatsappBtn.addEventListener('click', function() {
            const message = document.getElementById('message').value.trim();

            // --- NUEVA VALIDACIÓN ---
            if (!message) {
                alert('Por favor, escribe un mensaje para continuar.');
                return; // Detiene la ejecución si el mensaje está vacío
            }

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim(); // Aunque no se usa en el msg de WA, lo obtenemos por consistencia
            const finalMessage = buildMessageBody(name, email, message);
            
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
            window.open(whatsappLink, '_blank');
        });
    }
});