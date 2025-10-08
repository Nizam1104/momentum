"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LetterData {
  char: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  id: string;
}

interface AnimatedTextProps {
  text?: string;
  fontSize?: string;
  color?: string;
  animationDuration?: number;
  startDelay?: number;
  onAnimationComplete?: () => void;
  showShadow?: boolean;
}

interface ChaosToClarityProps {
  onAnimationComplete?: () => void;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text = 'Momentum',
  fontSize = '4rem',
  color = '#000000',
  animationDuration = 1000,
  startDelay = 500,
  onAnimationComplete,
  showShadow = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [letterData, setLetterData] = useState<LetterData[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Generate random position within viewport
  const getRandomPosition = useCallback(() => {
    const margin = 100;
    const x = Math.random() * (window.innerWidth - margin * 2) + margin;
    const y = Math.random() * (window.innerHeight - margin * 2) + margin;
    return { x, y };
  }, []);

  // Bezier curve calculation for smooth path
  const getBezierPoint = useCallback((t: number, startX: number, startY: number, endX: number, endY: number) => {
    // Create control points for a smooth curve
    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 200; // Arc upward
    
    // Quadratic bezier curve: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
    const x = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * midX + Math.pow(t, 2) * endX;
    const y = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * midY + Math.pow(t, 2) * endY;
    
    return { x, y };
  }, []);

  // Initialize letter positions
  useEffect(() => {
    if (!containerRef.current || !measureRef.current) return;

    const measureRect = measureRef.current.getBoundingClientRect();
    
    // Get the position where the text should be centered
    const centerX = window.innerWidth / 2 - measureRect.width / 2;
    const centerY = window.innerHeight / 2 - measureRect.height / 2;

    const letters = text.split('');
    const newLetterData: LetterData[] = [];

    // Measure individual letter positions
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.fontSize = fontSize;
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempDiv);

    let accumulatedWidth = 0;
    
    letters.forEach((char, index) => {
      const randomPos = getRandomPosition();
      
      // Measure character width
      tempDiv.textContent = char === ' ' ? '\u00A0' : char;
      const charWidth = tempDiv.getBoundingClientRect().width;
      
      newLetterData.push({
        char,
        startX: randomPos.x,
        startY: randomPos.y,
        endX: centerX + accumulatedWidth,
        endY: centerY,
        id: `letter-${index}`,
      });
      
      accumulatedWidth += charWidth;
    });

    document.body.removeChild(tempDiv);
    setLetterData(newLetterData);

    // Start animation after delay
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [text, fontSize, getRandomPosition, startDelay]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Hidden measure div */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          fontSize,
          fontFamily: 'Arial, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>

      {/* Animated letters */}
      {letterData.map((data, index) => (
        <AnimatedLetter
          key={data.id}
          data={data}
          fontSize={fontSize}
          color={color}
          isAnimating={isAnimating}
          animationDuration={animationDuration}
          delay={index * 0}
          getBezierPoint={getBezierPoint}
          showShadow={showShadow && animationComplete}
          onAnimationComplete={index === letterData.length - 1 ? () => {
            setAnimationComplete(true);
            onAnimationComplete?.();
          } : undefined}
        />
      ))}
    </div>
  );
};

interface AnimatedLetterProps {
  data: LetterData;
  fontSize: string;
  color: string;
  isAnimating: boolean;
  animationDuration: number;
  delay: number;
  getBezierPoint: (t: number, startX: number, startY: number, endX: number, endY: number) => { x: number; y: number };
  onAnimationComplete?: () => void;
  showShadow?: boolean;
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  data,
  fontSize,
  color,
  isAnimating,
  animationDuration,
  delay,
  getBezierPoint,
  onAnimationComplete,
  showShadow = false,
}) => {
  const [currentPosition, setCurrentPosition] = useState({ x: data.startX, y: data.startY });
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isAnimating) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;
      
      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      const position = getBezierPoint(
        easeProgress,
        data.startX,
        data.startY,
        data.endX,
        data.endY
      );
      
      setCurrentPosition(position);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, data, animationDuration, delay, getBezierPoint, onAnimationComplete]);

  return (
    <span
      style={{
        position: 'absolute',
        left: currentPosition.x,
        top: currentPosition.y,
        fontSize,
        color,
        fontFamily: 'Arial, sans-serif',
        userSelect: 'none',
        pointerEvents: 'none',
        textShadow: showShadow ? '4px 4px 8px rgba(100, 100, 100, 0.6)' : 'none',
        transition: showShadow ? 'text-shadow 0.5s ease-in' : 'none',
      }}
    >
      {data.char === ' ' ? '\u00A0' : data.char}
    </span>
  );
};

const ChaosToClarity: React.FC<ChaosToClarityProps> = ({ onAnimationComplete, className }) => {

  const handleAnimationComplete = () => {
    setTimeout(() => {
    }, 500);
    onAnimationComplete?.();
  };

  return (
    <div className={className} style={{
      backgroundColor: '#1a1a1a',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '100vw',
    }}>
      <AnimatedText
        text="MOMENTUM"
        fontSize="8rem"
        color="#ebf4f5"
        animationDuration={2000}
        startDelay={1}
        showShadow={true}
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default ChaosToClarity;
