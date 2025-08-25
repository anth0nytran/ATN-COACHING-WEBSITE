"use client";

import React, { useEffect, useRef } from "react";

interface Orb {
	x: number;
	y: number;
	r: number;
	baseR: number;
	hue: number;
	opacity: number;
	pulseSpeed: number;
	vx: number;
	vy: number;
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
}

export default function AmbientBackground() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const rafRef = useRef<number | null>(null);
	const dprRef = useRef<number>(1);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		dprRef.current = dpr;

		let width = 0;
		let height = 0;

		const orbs: Orb[] = [];
		const particles: Particle[] = [];

		const resize = () => {
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();

		// Initialize entities
		const rand = (min: number, max: number) => Math.random() * (max - min) + min;
		const initOrbs = (count: number) => {
			orbs.length = 0;
			for (let i = 0; i < count; i++) {
				const baseR = rand(120, 220);
				orbs.push({
					x: rand(0, width),
					y: rand(0, height),
					r: baseR,
					baseR,
					hue: rand(350, 10), // red range (wraps around)
					opacity: rand(0.04, 0.08),
					pulseSpeed: rand(0.0006, 0.0012),
					vx: rand(-0.05, 0.05),
					vy: rand(-0.05, 0.05),
				});
			}
		};
		const initParticles = (count: number) => {
			particles.length = 0;
			for (let i = 0; i < count; i++) {
				particles.push({
					x: rand(0, width),
					y: rand(0, height),
					vx: rand(-0.08, 0.08),
					vy: rand(-0.05, 0.05),
					size: rand(0.6, 1.6),
					alpha: rand(0.25, 0.55),
				});
			}
		};
		initOrbs(3);
		initParticles(90);

		let t = 0;
		const render = () => {
			t += 1;
			ctx.clearRect(0, 0, width, height);

			// Subtle dark background (neutral, not blue)
			const grd = ctx.createLinearGradient(0, 0, 0, height);
			// Medium charcoal instead of near-black
			grd.addColorStop(0, "rgba(22, 24, 28, 0.96)");
			grd.addColorStop(1, "rgba(12, 14, 16, 0.98)");
			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, width, height);

			// Orbs
			for (const o of orbs) {
				// Pulse radius
				o.r = o.baseR + Math.sin(t * o.pulseSpeed) * 18;
				o.x += o.vx;
				o.y += o.vy;
				if (o.x < -200) o.x = width + 200; if (o.x > width + 200) o.x = -200;
				if (o.y < -200) o.y = height + 200; if (o.y > height + 200) o.y = -200;

				const orbGradient = ctx.createRadialGradient(o.x, o.y, o.r * 0.1, o.x, o.y, o.r);
				orbGradient.addColorStop(0, `hsla(${o.hue}, 82%, 58%, ${o.opacity})`);
				orbGradient.addColorStop(1, "rgba(0,0,0,0)");
				ctx.fillStyle = orbGradient;
				ctx.beginPath();
				ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
				ctx.fill();
			}

			// Particles
			ctx.fillStyle = "rgba(255,255,255,0.25)";
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
				ctx.globalAlpha = p.alpha;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;

			rafRef.current = requestAnimationFrame(render);
		};
		rafRef.current = requestAnimationFrame(render);

		const handleResize = () => {
			resize();
		};
		window.addEventListener("resize", handleResize);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className="absolute inset-0 w-full h-full"
			style={{ pointerEvents: "none", filter: "blur(0.2px)" }}
		/>
	);
}
