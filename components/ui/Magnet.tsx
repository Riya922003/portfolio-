import React, { useState, useEffect, useRef, ReactNode, HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  console.log('🧲 Magnet component RENDERED! Position:', position, 'isActive:', isActive);
  
  // Add a mount effect to confirm the component is working
  useEffect(() => {
    console.log('🧲 Magnet component MOUNTED!');
    return () => console.log('🧲 Magnet component UNMOUNTED!');
  }, []);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      console.log('🧲 Mouse move detected in Magnet!', { x: e.clientX, y: e.clientY });
      
      if (!magnetRef.current) {
        console.log('🧲 No magnetRef.current');
        return;
      }

      const rect = magnetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding;

      console.log('🧲 Distance calculation:', { 
        distance, 
        maxDistance, 
        centerX, 
        centerY, 
        mouseX: e.clientX, 
        mouseY: e.clientY,
        elementRect: rect
      });

      if (distance < maxDistance) {
        console.log('🧲 WITHIN MAGNETIC FIELD!', distance, '<', maxDistance);
        setIsActive(true);
        const strength = Math.min(distance / maxDistance, 1);
        const offsetX = (distanceX * strength) / magnetStrength;
        const offsetY = (distanceY * strength) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
        console.log('🧲 Setting magnet position:', { offsetX, offsetY, strength });
      } else {
        if (isActive) {
          console.log('🧲 LEAVING MAGNETIC FIELD');
        }
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    console.log('🧲 Adding mouse event listeners to document');
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Test the event listener immediately
    setTimeout(() => {
      console.log('🧲 Testing if Magnet component is responding...');
    }, 1000);
    
    return () => {
      console.log('🧲 Removing mouse event listeners');
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, disabled, magnetStrength, isActive]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        cursor: 'pointer',
        border: '2px dashed lime', // Debug border
        padding: '5px'
      }}
      onMouseEnter={() => console.log('🧲 Mouse ENTERED Magnet wrapper')}
      onMouseLeave={() => console.log('🧲 Mouse LEFT Magnet wrapper')}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: 'transform',
          transformOrigin: 'center',
          border: '1px solid orange' // Debug border for inner div
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;