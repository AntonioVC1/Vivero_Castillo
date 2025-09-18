// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL MENÚ MÓVIL (HAMBURGUESA) ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

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
    // --- LÓGICA CORREGIDA PARA EL FORMULARIO DE CONTACTO ---
    // ===================================================================
    const contactForm = document.getElementById('contactForm');
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    // --- DATOS DE CONTACTO ---
    const recipientEmail = 'viverocastillo@gmail.com';
    const whatsappNumber = '522228919841'; // Sin el "+"

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