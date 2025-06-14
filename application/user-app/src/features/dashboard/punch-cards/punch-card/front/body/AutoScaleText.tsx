import React, { useEffect, useRef, useState } from 'react';

interface AutoScaleTextProps {
  children: string;
  className?: string;
  maxFontSize?: string;
  minFontSize?: string;
}

const AutoScaleText: React.FC<AutoScaleTextProps> = ({
  children,
  className,
  maxFontSize = '1.8em',
  minFontSize = '0.3em'
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current;
    const parent = text.parentElement;
    if (!parent) return;

    text.style.fontSize = maxFontSize;
    
    if (text.scrollWidth <= parent.offsetWidth) {
      setFontSize(maxFontSize);
      return;
    }

    const maxFontSizePx = parseFloat(getComputedStyle(text).fontSize);
    const minFontSizePx = parseFloat(minFontSize) * 16; // assuming em units
    
    let currentSize = maxFontSizePx;
    
    while (text.scrollWidth > parent.offsetWidth && currentSize > minFontSizePx) {
      currentSize -= 1;
      text.style.fontSize = `${currentSize}px`;
    }
    
    setFontSize(`${currentSize}px`);
  }, [children, maxFontSize, minFontSize]);

  return (
    <div 
      ref={textRef} 
      className={className}
      style={{ fontSize }}
    >
      {children}
    </div>
  );
};

export default AutoScaleText; 