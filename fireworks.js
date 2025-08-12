// Fireworks effect
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('fireworks');
    if (!canvas) { // Si no existe el canvas de fireworks, no hacer nada.
        // console.warn("Elemento canvas con ID 'fireworks' no encontrado.");
        return;
    }
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    // Fireworks array
    const fireworks = [];
    const particles = [];
    
    // Firework class
    class Firework {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = canvas.height / 4 + Math.random() * (canvas.height / 3); // Explota más arriba
            this.speed = 2 + Math.random() * 4; // Un poco más rápido
            this.radius = 2.5;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`; // Colores más brillantes
            this.alive = true;
        }
        
        update() {
            this.y -= this.speed;
            this.speed *= 0.99; // Desaceleración ligera
            
            if (this.y <= this.targetY) {
                this.explode();
                this.alive = false;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        explode() {
            const particleCount = 80 + Math.floor(Math.random() * 70); // Más partículas
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }
    
    // Particle class
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 6 + 2; // Velocidad de partículas
            this.friction = 0.96; // Más fricción para que no se expandan tanto
            this.gravity = 0.15; // Gravedad un poco menor
            this.alpha = 1;
            this.decay = Math.random() * 0.01 + 0.01; // Decaimiento más lento
            this.radius = Math.random() * 2.5 + 1;
        }
        
        update() {
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
            return this.alpha > 0.05; // Que duren un poco más
        }
        
        draw() {
            ctx.save(); // Guardar estado del contexto
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore(); // Restaurar estado del contexto
        }
    }
    
    let animationFrameId = null; // Para poder detener la animación si es necesario

    function loop() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'; // Rastro un poco más persistente
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.025) { // Frecuencia de lanzamiento
            fireworks.push(new Firework());
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            
            if (!fireworks[i].alive) {
                fireworks.splice(i, 1);
            }
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
        
        animationFrameId = requestAnimationFrame(loop);
    }
    
    window.addEventListener('resize', function() {
        resizeCanvas();
    });
    
    // Iniciar solo si la página está visible para ahorrar recursos
    function handleVisibilityChange() {
        if (document.hidden) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        } else {
            if (!animationFrameId) {
                loop();
            }
        }
    }

    if (typeof document.hidden !== "undefined") { // Soporte para Page Visibility API
        document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    
    // Iniciar la animación
    if (!document.hidden) { // No iniciar si la pestaña está oculta al cargar
        loop();
    }
});