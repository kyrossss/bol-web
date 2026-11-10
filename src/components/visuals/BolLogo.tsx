import React from 'react';

interface BolLogoProps {
  className?: string;
  size?: number;
  tone?: 'champagne' | 'ivory' | 'ink';
}

/**
 * BoL 三圆连接图形标志（遵循 VI 手册 4.1 规范：三个相连的圆形结构，不拉伸、不加冗余阴影或廉价渐变）
 */
export const BolLogoMark: React.FC<BolLogoProps> = ({
  className = '',
  size = 28,
  tone = 'champagne',
}) => {
  const strokeMap = {
    champagne: '#D8B98A',
    ivory: '#F2EFE9',
    ink: '#0B0B0C',
  };
  const strokeColor = strokeMap[tone];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Top / Center Ring */}
      <circle
        cx="24"
        cy="16.5"
        r="10.5"
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Bottom Left Ring */}
      <circle
        cx="16.5"
        cy="29.5"
        r="10.5"
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Bottom Right Ring */}
      <circle
        cx="31.5"
        cy="29.5"
        r="10.5"
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Subtle central intersection nexus point */}
      <circle cx="24" cy="25.2" r="1.75" fill={strokeColor} />
    </svg>
  );
};
