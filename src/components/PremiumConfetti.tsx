'use client';

import React, { useEffect, useState } from 'react';

type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    emoji?: string;
    angle: number;
    speed: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
};

const SHAPES = ['square', 'circle', 'triangle'];
const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8', '#fdcb6e'];
const EMOJIS = ['🎉', '🌟', '✨', '🏆', '🥳', '🎈'];

export default function PremiumConfetti({ active }: { active: boolean }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!active) {
            setParticles([]);
            return;
        }

        // Initialize particles with random values
        const count = 120;
        const initialParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
            const isEmoji = Math.random() > 0.6;
            initialParticles.push({
                id: i,
                x: Math.random() * 100, // percentage from left
                y: -10 - Math.random() * 20, // start above viewport
                size: isEmoji ? 24 + Math.random() * 16 : 8 + Math.random() * 12,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                emoji: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
                angle: Math.random() * Math.PI * 2,
                speed: 0.8 + Math.random() * 1.7,
                rotation: Math.random() * 360,
                rotationSpeed: -4 + Math.random() * 8,
                opacity: 1
            });
        }

        setParticles(initialParticles);

        // Animation frame loop
        let animationFrameId: number;
        let lastTime = Date.now();

        const update = () => {
            const now = Date.now();
            const delta = (now - lastTime) / 1000;
            lastTime = now;

            setParticles(prev => 
                prev.map(p => {
                    const nextY = p.y + p.speed * 60 * delta;
                    // sway back and forth
                    const nextX = p.x + Math.sin(nextY / 30 + p.id) * 0.2;
                    const nextRotation = p.rotation + p.rotationSpeed * 60 * delta;
                    // start fading out near bottom
                    const nextOpacity = nextY > 80 ? Math.max(0, 1 - (nextY - 80) / 20) : 1;

                    return {
                        ...p,
                        x: nextX,
                        y: nextY,
                        rotation: nextRotation,
                        opacity: nextOpacity
                    };
                }).filter(p => p.y < 110 && p.opacity > 0)
            );

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active]);

    if (!active || particles.length === 0) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute transition-transform duration-75 ease-out select-none"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                        opacity: p.opacity,
                    }}
                >
                    {p.emoji ? (
                        <span style={{ fontSize: `${p.size}px` }}>{p.emoji}</span>
                    ) : (
                        <div
                            style={{
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                backgroundColor: p.color,
                                borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                                transform: p.id % 3 === 0 ? 'skewX(15deg)' : 'none'
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
