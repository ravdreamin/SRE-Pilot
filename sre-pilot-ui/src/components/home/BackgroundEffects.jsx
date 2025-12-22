import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export const GraphParticleEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null };

        const colors = [
            'rgba(66, 133, 244, 0.8)',
            'rgba(234, 67, 53, 0.8)',
            'rgba(251, 188, 5, 0.8)',
            'rgba(52, 168, 83, 0.8)'
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.size = Math.random() * 3 + 1.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                if (mouse.x != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 200) {
                        const force = (200 - distance) / 200;
                        this.vx -= (dx / distance) * force * 0.1;
                        this.vy -= (dy / distance) * force * 0.1;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 12000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        const colorParts = particles[i].color.match(/rgba?\((\d+), (\d+), (\d+)/);
                        if (colorParts) {
                            const alpha = 0.2 - (distance / 120) * 0.2;
                            ctx.strokeStyle = `rgba(${colorParts[1]}, ${colorParts[2]}, ${colorParts[3]}, ${alpha})`;
                        }
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            particles.forEach(particle => { particle.update(); particle.draw(); });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => { mouse.x = e.x; mouse.y = e.y; }
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        resizeCanvas();
        animate();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: 'transparent', pointerEvents: 'none' }} />
    );
};

export const DotGridEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const dots = [];
        const spacing = 30;

        const init = () => {
            const cols = Math.ceil(canvas.width / spacing);
            const rows = Math.ceil(canvas.height / spacing);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push({
                        x: i * spacing,
                        y: j * spacing,
                        baseX: i * spacing,
                        baseY: j * spacing,
                        size: 1.5,
                        opacity: Math.random() * 0.5 + 0.1,
                        offset: Math.random() * 100
                    });
                }
            }
        };
        init();

        const animate = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#1d1d1f";

            dots.forEach(dot => {
                // Gentle floating
                dot.y = dot.baseY + Math.sin((time / 1000) + dot.offset) * 3;

                ctx.globalAlpha = dot.opacity;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate(0);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.2, pointerEvents: "none" }} />;
};

export const PerspectiveGridEffect = () => {
    return (
        <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
            perspective: "1000px",
            opacity: 0.4
        }}>
            <motion.div
                style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    transform: "rotateX(60deg)"
                }}
                animate={{ translateY: ["0px", "60px"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, transparent 0%, white 100%)" }} />
        </Box>
    );
};
