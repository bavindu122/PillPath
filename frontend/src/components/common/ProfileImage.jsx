import React from 'react';
import { assets } from '../../assets/assets';

const ProfileImage = ({ 
  src, 
  alt = "Profile picture", 
  className = "", 
  fallbackSrc = assets.profile_pic,
  ...props 
}) => {
  const handleError = (e) => {
    if (e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  };

  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      className={`object-cover ${className}`}
      onError={handleError}
      {...props}
    />
  );
};

export default ProfileImage;