import React, { useState } from 'react';

interface AccessoryIconProps {
  readonly id: string;
  readonly name: string;
  readonly fallbackEmoji: string;
  readonly size?: number;
}

export const AccessoryIcon: React.FC<AccessoryIconProps> = ({
  id,
  name,
  fallbackEmoji,
  size = 32
}) => {
  const [hasError, setHasError] = useState(false);
  const iconSrc = `/icons/accessories/${id.toLowerCase()}.png`;

  if (hasError) {
    return (
      <span
        style={{
          fontSize: `${size * 0.75}px`,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-hidden="true"
      >
        {fallbackEmoji}
      </span>
    );
  }

  return (
    <img
      src={iconSrc}
      alt={name}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        imageRendering: 'pixelated',
        display: 'block'
      }}
    />
  );
};
