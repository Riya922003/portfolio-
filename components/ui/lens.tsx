"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface LensProps {
  children?: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
  className?: string;
  /** optional image src to use for the lens overlay (when you don't want to wrap the image) */
  imageSrc?: string;
  showAlways?: boolean;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
  className = "",
  imageSrc,
  showAlways = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [localIsHovering, setLocalIsHovering] = useState(false);

  const isHovering = showAlways ? true : hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  // const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    // store last rect on the ref for background positioning
    // we attach it to containerRef.current as a simple cache
    if (containerRef.current) {
      (containerRef.current as any)._lastRect = rect;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg z-20 w-full h-full ${
        (className as string) || ""
      }`}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
    {/* Render children (if provided). When using `imageSrc`, you can leave the original <Image> in the DOM
      and use Lens as an absolute overlay by passing imageSrc to avoid interfering with Next/Image layout. */}
    {imageSrc ? null : children}
      {isStatic ? (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
            style={{
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                position.x
              }px ${position.y}px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                position.x
              }px ${position.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${position.x}px ${position.y}px`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${position.x}px ${position.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {isHovering && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                    mousePosition.x
                  }px ${mousePosition.y}px, black 100%, transparent 100%)`,
                  WebkitMaskImage: `radial-gradient(circle ${
                    lensSize / 2
                  }px at ${mousePosition.x}px ${
                    mousePosition.y
                  }px, black 100%, transparent 100%)`,
                  transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  zIndex: 50,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  }}
                >
                  {/* If imageSrc is provided, render a background image positioned to the mouse. Otherwise render children */}
                  {imageSrc ? (
                    <div
                      className="absolute inset-0 bg-no-repeat"
                      style={{
                        backgroundImage: `url(${imageSrc})`,
                        // background position in percent based on mouse within container
                        backgroundPosition: (() => {
                          const rect = (containerRef.current as any)?._lastRect;
                          if (!rect) return "50% 50%";
                          const px = (mousePosition.x / rect.width) * 100;
                          const py = (mousePosition.y / rect.height) * 100;
                          return `${px}% ${py}%`;
                        })(),
                        backgroundSize: `${zoomFactor * 100}% ${zoomFactor * 100}%`,
                      }}
                    />
                  ) : (
                    children
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
