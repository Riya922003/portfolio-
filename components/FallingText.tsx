'use client';

import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';

interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  trigger?: 'auto' | 'scroll' | 'click' | 'hover';
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  onAnimationComplete?: () => void;
}

const FallingText: React.FC<FallingTextProps> = ({
  text = '',
  highlightWords = [],
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  // Initialize text HTML
  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');

    const newHTML = words
      .map(word => {
        const isHighlighted = highlightWords.some(hw => word.toLowerCase().startsWith(hw.toLowerCase()));
        return `<span class="inline-block mx-1 select-none text-white font-medium ${isHighlighted ? 'text-cyan-400 font-bold' : 'text-white'}">${word}</span>`;
      })
      .join(' ');

    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords]);

  // Handle trigger logic
  useEffect(() => {
    if (trigger === 'auto') {
      const timer = setTimeout(() => setEffectStarted(true), 500);
      return () => clearTimeout(timer);
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  // Main physics effect
  useEffect(() => {
    if (!effectStarted || !containerRef.current || !canvasContainerRef.current || !textRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    // Get container dimensions - use full screen
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width <= 0 || height <= 0) return;

    // Create engine
    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
        showVelocity: false,
        showAngleIndicator: false,
        showDebug: false
      }
    });
    renderRef.current = render;

    // Create boundaries
    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };
    const floor = Bodies.rectangle(width / 2, height - 25, width * 2, 50, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);

    // Get word elements
    const wordSpans = textRef.current.querySelectorAll('span');
    const wordBodies: Array<{ elem: HTMLElement; body: Matter.Body }> = [];

    // Create new word elements directly in the DOM for physics
    const words = text.split(' ');
    
    words.forEach((word, index) => {
      // Start all words from center of screen in a compact formation
      const wordsPerRow = 4;
      const row = Math.floor(index / wordsPerRow);
      const col = index % wordsPerRow;
      
      const x = width / 2 + (col - wordsPerRow / 2 + 0.5) * 180;
      const y = height / 2 + row * 60 - 50;

      // Create DOM element for this word
      const wordElement = document.createElement('div');
      const isHighlighted = highlightWords.some(hw => word.toLowerCase().startsWith(hw.toLowerCase()));
      
      wordElement.textContent = word;
      wordElement.style.position = 'fixed';
      wordElement.style.left = `${x}px`;
      wordElement.style.top = `${y}px`;
      wordElement.style.transform = 'translate(-50%, -50%)';
      wordElement.style.pointerEvents = 'none';
      wordElement.style.zIndex = '1000';
      wordElement.style.fontSize = fontSize;
      wordElement.style.fontWeight = isHighlighted ? 'bold' : 'normal';
      wordElement.style.color = isHighlighted ? '#22d3ee' : 'white';
      wordElement.style.userSelect = 'none';
      wordElement.style.whiteSpace = 'nowrap';

      // Add to container
      containerRef.current!.appendChild(wordElement);

      // Create physics body
      const bodyWidth = Math.max(word.length * 20, 80);
      const bodyHeight = 40;
      
      const body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
        render: { fillStyle: 'transparent' },
        restitution: 0.7,
        frictionAir: 0.01,
        friction: 0.2,
        density: 0.002
      });

      // Add some initial velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 2
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);

      wordBodies.push({ elem: wordElement, body });
    });

    // Mouse constraint
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false }
      }
    });

    // Add all bodies to world
    World.add(engine.world, [
      floor, 
      leftWall, 
      rightWall, 
      mouseConstraint, 
      ...wordBodies.map(wb => wb.body)
    ]);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    // Update loop for DOM elements with completion detection
    let animationCompleted = false;
    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });

      // Check if animation is complete (all words have settled at bottom)
      if (!animationCompleted) {
        const allSettled = wordBodies.every(({ body }) => {
          const velocity = Math.abs(body.velocity.x) + Math.abs(body.velocity.y);
          const angularVelocity = Math.abs(body.angularVelocity);
          return velocity < 0.5 && angularVelocity < 0.05 && body.position.y > height - 200;
        });

        if (allSettled) {
          animationCompleted = true;
          setTimeout(() => {
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }, 1500); // Wait 1.5 seconds after settling
        }
      }
      
      if (engineRef.current) {
        requestAnimationFrame(updateLoop);
      }
    };
    updateLoop();

    // Cleanup function
    return () => {
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas && canvasContainerRef.current?.contains(renderRef.current.canvas)) {
          canvasContainerRef.current.removeChild(renderRef.current.canvas);
        }
      }
      if (engineRef.current) {
        World.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
      
      // Remove dynamically created word elements
      wordBodies.forEach(({ elem }) => {
        if (elem && elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      });
      
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 cursor-pointer text-center overflow-hidden"
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center z-10 text-center"
        style={{
          fontSize,
          lineHeight: 1.4,
          opacity: 0, // Hidden since we create our own word elements
          pointerEvents: 'none'
        }}
      />
      
      <div 
        ref={canvasContainerRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
      />
    </div>
  );
};

export default FallingText;