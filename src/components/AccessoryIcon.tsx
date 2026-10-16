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
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Generate potential filenames to ensure icon always loads
  const candidates = React.useMemo(() => {
    const rawId = id.toLowerCase().replace(/^trpixel:/, '');
    const withoutS = rawId.replace(/_s_/g, '_').replace(/s_/g, '');
    const normalizedName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    const cleanId = rawId.replace(/[^a-z0-9_]/g, '');

    const list = [
      `/icons/accessories/${cleanId}.png`,
      `/icons/accessories/${withoutS}.png`,
      `/icons/accessories/${normalizedName}.png`
    ];
    return Array.from(new Set(list));
  }, [id, name]);

  // Reset candidate index when id changes
  React.useEffect(() => {
    setCandidateIndex(0);
  }, [id]);

  if (candidateIndex >= candidates.length) {
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
      src={candidates[candidateIndex]}
      alt={name}
      width={size}
      height={size}
      onError={() => setCandidateIndex(prev => prev + 1)}
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
