"use client";

import React, { useEffect, useRef, useState } from "react";

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

interface RevealProps {
	children: React.ReactNode;
	as?: IntrinsicTag;
	className?: string;
	staggerDelayMs?: number;
  style?: React.CSSProperties;
}

export default function Reveal({ children, as = "div", className, staggerDelayMs = 0, style }: RevealProps) {
	const ref = useRef<HTMLElement | null>(null as any);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current as unknown as Element | null;
		if (!el) return;
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setTimeout(() => setVisible(true), staggerDelayMs);
					}
				});
			},
			{ threshold: 0.22 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [staggerDelayMs]);

	const Tag = as as any;
	return (
		<Tag
			ref={ref as any}
			className={className}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translateY(0px)" : "translateY(14px)",
				transition: "opacity 420ms ease-out, transform 420ms ease-out",
				...style,
			}}
		>
			{children}
		</Tag>
	);
}
