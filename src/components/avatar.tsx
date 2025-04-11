tsx
import React from 'react';

interface AvatarProps {
  src?: string;
  initials?: string;
  className?: string;
  square?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ src, initials, className, square }) => {
  const avatarClass = `rounded-full ${square ? 'rounded-none' : ''} ${className}`;

  if (src) {
    return <img src={src} alt="avatar" className={avatarClass} />;
  }

  if (initials) {
    return (
      <div className={`${avatarClass} flex items-center justify-center bg-gray-200 text-gray-700`}>
        {initials}
      </div>
    );
  }

  // Default avatar (replace with your preferred default)
  return <div className={`${avatarClass} bg-gray-200`}></div>;
};

export default Avatar;