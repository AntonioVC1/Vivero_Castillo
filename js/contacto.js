document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lee los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const nombreProducto = params.get('producto');

    // Si el parámetro "producto" existe...
    if (nombreProducto) {
        
        // 2. Rellena el <textarea> del formulario
        const mensajeTextarea = document.getElementById('message');
        if (mensajeTextarea) {
            const mensajePrecargado = `Hola, estoy interesado en cotizar el siguiente producto: ${nombreProducto}\n\n`;
            mensajeTextarea.value = mensajePrecargado;
        }

        // 3. Actualiza el botón de WhatsApp
        const whatsappBtn = document.getElementById('whatsappBtn');
        if (whatsappBtn) {
            // Usamos el número que tienes en tu HTML
            const tuNumeroWhatsapp = '2218919841'; 
            
            // Creamos el mensaje para WhatsApp
            const mensajeWhatsapp = encodeURIComponent(`Hola, estoy interesado en cotizar: ${nombreProducto}`);
            const whatsappLink = `https://wa.me/${tuNumeroWhatsapp}?text=${mensajeWhatsapp}`;

            // Re-asignamos el evento 'click' para este botón
            // (Esto sobreescribe cualquier listener que tuviera antes)
            whatsappBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Previene cualquier acción por defecto
                window.open(whatsappLink, '_blank');
            });
        }
    }
});