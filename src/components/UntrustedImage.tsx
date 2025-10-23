"use client";

import { useState, useEffect, SyntheticEvent } from "react";

interface UntrustedImageProps {
  src?: string | null;
  alt: string;
  className: string;
  fallbackSrc?: string;
}

export default function UntrustedImage({ src, alt, className, fallbackSrc = "/fallback.png" }: UntrustedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc === fallbackSrc) {
      e.currentTarget.style.display = "none";
      return;
    }

    setCurrentSrc(fallbackSrc);
  };

  return <img src={currentSrc} alt={alt} className={`${className}`} onError={handleImageError} loading="lazy" />;
}
