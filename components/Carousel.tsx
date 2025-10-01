"use client"

import { useEffect, useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Updated CarouselItem type to match your project data
export interface CarouselItem {
  id: number;
  name: string;
  description: string;
  tech: string[];
  link: string;
  image: string; // URL for the project image
}

export interface CarouselProps {
  items: CarouselItem[]; // Removed default items
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  onIndexChange?: (index: number) => void;
}

const DRAG_BUFFER = 10;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 } as any;

export default function Carousel({
  items, // Items are now required
  baseWidth = 450,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  onIndexChange,
}: CarouselProps) {

  // =================================================================
  // THE FIX: Add this guard clause at the top of the component
  // =================================================================
  // If no items are provided, render a neutral placeholder container and
  // let the parent decide what message to show (loading / no projects).
  if (!items || items.length === 0) {
    return (
      <div
        className="relative flex items-center justify-center p-4 rounded-[24px] border border-[#222]"
        style={{ width: baseWidth, height: 380 }}
      />
    );
  }
  // =================================================================

  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const updateCurrentIndex = (newIndex: number) => {
    setCurrentIndex(newIndex);
    if (onIndexChange) {
      onIndexChange(newIndex % items.length);
    }
  };

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        const newIndex = (currentIndex + 1) % carouselItems.length;
        updateCurrentIndex(newIndex);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, carouselItems.length, pauseOnHover, currentIndex]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      updateCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (currentIndex < carouselItems.length - 1) {
        updateCurrentIndex(currentIndex + 1);
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (currentIndex > 0) {
        updateCurrentIndex(currentIndex - 1);
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0
        }
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 rounded-[24px] border border-[#222]`}
      style={{
        width: `${baseWidth}px`,
        height: 380,
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: '100%',
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
            const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
            const outputRange = [90, 0, -90];
            const rotateY = useTransform(x, range, outputRange, { clamp: false });

            return (
              <motion.div
                key={item.id + '-' + index}
                className="relative shrink-0 flex flex-col bg-[#111] border border-[#222] rounded-[12px] overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                  width: itemWidth,
                  height: '100%',
                  rotateY: rotateY,
                }}
                transition={effectiveTransition}
              >
                {/* MODIFIED CARD CONTENT */}
                <div className="w-full h-40 mb-4 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                    width={300}
                    height={160}
                    priority={index === 0}
                    unoptimized
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-neutral-400 line-clamp-3">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tech?.slice(0, 3).map((t, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300">{t}</span>
                    ))}
                  </div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-auto text-xs font-semibold text-white hover:text-neutral-300 flex items-center gap-1">
                    View Project <ArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            );
        })}
      </motion.div>

      {/* Pagination dots */}
      <div className={`flex w-full justify-center absolute z-20 bottom-4 left-1/2 -translate-x-1/2`}>
        <div className="mt-4 flex gap-2">
          {items.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index
                  ? 'bg-white'
                  : 'bg-neutral-600'
              }`}
              onClick={() => updateCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}