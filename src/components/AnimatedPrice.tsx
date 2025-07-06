import { useEffect, useState } from "react";

interface AnimatedPriceProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
}

export function AnimatedPrice({ value, duration = 400, className = "", prefix = "£" }: AnimatedPriceProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      const startValue = displayValue;
      const difference = value - startValue;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (difference * easeOutQuart);
        setDisplayValue(Math.round(currentValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value, duration, displayValue]);

  return (
    <span className={`${className} ${isAnimating ? 'transition-all duration-100' : ''}`}>
      {prefix}{displayValue.toLocaleString()}
    </span>
  );
}
