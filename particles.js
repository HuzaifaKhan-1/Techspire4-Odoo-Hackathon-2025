// Enhanced Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.container.appendChild(this.canvas);
        this.resize();
    }
    
    createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate particles for new dimensions
        this.particles.forEach(particle => {
            particle.maxX = this.canvas.width;
            particle.maxY = this.canvas.height;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.5;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.container.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(maxX, maxY) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.x = Math.random() * maxX;
        this.y = Math.random() * maxY;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
        this.hue = Math.random() * 60 + 220; // Blue to purple range
    }
    
    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.vx += (dx / distance) * force * 0.2;
            this.vy += (dy / distance) * force * 0.2;
        } else {
            // Return to original velocity
            this.vx += (this.originalVx - this.vx) * 0.05;
            this.vy += (this.originalVy - this.vy) * 0.05;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if (this.x < 0) this.x = this.maxX;
        if (this.x > this.maxX) this.x = 0;
        if (this.y < 0) this.y = this.maxY;
        if (this.y > this.maxY) this.y = 0;
        
        // Gentle pulsing opacity
        this.opacity = 0.5 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.3;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Gradient for particle
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `hsl(${this.hue}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${this.hue}, 70%, 20%)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = `hsl(${this.hue}, 70%, 50%)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.restore();
    }
}

// Constellation Pattern Generator
class ConstellationPattern {
    constructor(container) {
        this.container = container;
        this.stars = [];
        this.constellations = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.generateConstellations();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.opacity = '0.3';
        
        this.container.appendChild(this.canvas);
        this.resize();
    }
    
    generateConstellations() {
        const patterns = [
            // Big Dipper pattern
            [
                { x: 0.2, y: 0.3 }, { x: 0.25, y: 0.25 }, { x: 0.3, y: 0.28 },
                { x: 0.35, y: 0.32 }, { x: 0.4, y: 0.35 }, { x: 0.38, y: 0.4 },
                { x: 0.33, y: 0.42 }
            ],
            // Cassiopeia pattern
            [
                { x: 0.6, y: 0.2 }, { x: 0.65, y: 0.15 }, { x: 0.7, y: 0.18 },
                { x: 0.75, y: 0.12 }, { x: 0.8, y: 0.16 }
            ],
            // Orion pattern
            [
                { x: 0.15, y: 0.7 }, { x: 0.2, y: 0.65 }, { x: 0.18, y: 0.75 },
                { x: 0.22, y: 0.8 }, { x: 0.25, y: 0.72 }, { x: 0.28, y: 0.78 },
                { x: 0.3, y: 0.68 }
            ]
        ];
        
        patterns.forEach(pattern => {
            const constellation = pattern.map(point => ({
                x: point.x * this.canvas.width,
                y: point.y * this.canvas.height,
                brightness: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() * 0.02 + 0.01
            }));
            
            this.constellations.push(constellation);
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Regenerate constellations for new dimensions
        this.constellations = [];
        this.generateConstellations();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        
        this.constellations.forEach(constellation => {
            // Draw stars
            constellation.forEach(star => {
                const brightness = star.brightness + Math.sin(time * star.twinkle) * 0.3;
                
                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0.1, brightness);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.shadowColor = '#ffffff';
                this.ctx.shadowBlur = 2;
                
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            });
            
            // Draw constellation lines
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            for (let i = 0; i < constellation.length - 1; i++) {
                if (i === 0) {
                    this.ctx.moveTo(constellation[i].x, constellation[i].y);
                } else {
                    this.ctx.lineTo(constellation[i].x, constellation[i].y);
                }
            }
            
            this.ctx.stroke();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.container.removeChild(this.canvas);
        }
    }
}

// Floating Geometric Shapes
class GeometricShapes {
    constructor(container) {
        this.container = container;
        this.shapes = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createShapes();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-3';
        this.canvas.style.opacity = '0.1';
        
        this.container.appendChild(this.canvas);
        this.resize();
    }
    
    createShapes() {
        const shapeTypes = ['triangle', 'square', 'circle', 'hexagon'];
        const shapeCount = 15;
        
        for (let i = 0; i < shapeCount; i++) {
            this.shapes.push({
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 60 + 20,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    drawShape(shape) {
        this.ctx.save();
        this.ctx.translate(shape.x, shape.y);
        this.ctx.rotate(shape.rotation);
        this.ctx.globalAlpha = shape.opacity;
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 2;
        
        const size = shape.size / 2;
        
        this.ctx.beginPath();
        
        switch (shape.type) {
            case 'triangle':
                this.ctx.moveTo(0, -size);
                this.ctx.lineTo(-size * 0.866, size * 0.5);
                this.ctx.lineTo(size * 0.866, size * 0.5);
                this.ctx.closePath();
                break;
                
            case 'square':
                this.ctx.rect(-size, -size, size * 2, size * 2);
                break;
                
            case 'circle':
                this.ctx.arc(0, 0, size, 0, Math.PI * 2);
                break;
                
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = size * Math.cos(angle);
                    const y = size * Math.sin(angle);
                    
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                break;
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.shapes.forEach(shape => {
            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotationSpeed;
            
            // Wrap around edges
            if (shape.x < -shape.size) shape.x = this.canvas.width + shape.size;
            if (shape.x > this.canvas.width + shape.size) shape.x = -shape.size;
            if (shape.y < -shape.size) shape.y = this.canvas.height + shape.size;
            if (shape.y > this.canvas.height + shape.size) shape.y = -shape.size;
            
            this.drawShape(shape);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.container.removeChild(this.canvas);
        }
    }
}

// Initialize particle systems when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        // Initialize all particle systems
        const particleSystem = new ParticleSystem(particlesContainer);
        const constellationPattern = new ConstellationPattern(particlesContainer);
        const geometricShapes = new GeometricShapes(particlesContainer);
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            particleSystem.destroy();
            constellationPattern.destroy();
            geometricShapes.destroy();
        });
        
        // Pause animations when page is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations
                if (particleSystem.animationId) {
                    cancelAnimationFrame(particleSystem.animationId);
                }
                if (constellationPattern.animationId) {
                    cancelAnimationFrame(constellationPattern.animationId);
                }
                if (geometricShapes.animationId) {
                    cancelAnimationFrame(geometricShapes.animationId);
                }
            } else {
                // Resume animations
                particleSystem.animate();
                constellationPattern.animate();
                geometricShapes.animate();
            }
        });
    }
});
