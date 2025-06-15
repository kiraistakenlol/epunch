import React from 'react';
import { Box } from '@mui/material';
import { IconDto } from 'e-punch-common-core';

interface SvgIconProps {
  icon: IconDto;
  size?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  style?: React.CSSProperties;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  icon,
  size = 24,
  color = 'currentColor',
  opacity = 1,
  rotation = 0,
  scaleX = 1,
  scaleY = 1,
  style = {}}) => {

  if (!icon.svg_content) {
    // Fallback: show icon name if no SVG content
    return (
      <Box
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.max(6, size / 6)}px`,
          color: '#666',
          fontWeight: 'bold',
          textAlign: 'center',
          flexDirection: 'column',
          opacity,
          transform: `rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
          ...style
        }}
        title={`${icon.name} - No SVG Content`}
      >
        <div style={{ fontSize: `${Math.max(4, size / 8)}px`, opacity: 0.7 }}>
          NO SVG
        </div>
      </Box>
    );
  }

  // Simple approach: render SVG with minimal modifications
  let svgContent = icon.svg_content;
  
  // Only modify size if needed - be more precise to only target root SVG element
  if (size !== 24) {
    // Replace width and height only in the opening <svg> tag
    svgContent = svgContent.replace(/<svg([^>]*)\swidth="[^"]*"/, `<svg$1 width="${size}"`);
    svgContent = svgContent.replace(/<svg([^>]*)\sheight="[^"]*"/, `<svg$1 height="${size}"`);
  }
  
  // Only modify color if specified and not currentColor
  if (color && color !== 'currentColor') {
    svgContent = svgContent.replace(/fill="currentColor"/g, `fill="${color}"`);
    svgContent = svgContent.replace(/stroke="currentColor"/g, `stroke="${color}"`);
  }

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-block',
    lineHeight: 1,
    opacity,
    transform: rotation !== 0 || scaleX !== 1 || scaleY !== 1 
      ? `rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})` 
      : undefined,
    ...style
  };

  return (
    <div 
      style={wrapperStyle}
      title={icon.name}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgIcon; 