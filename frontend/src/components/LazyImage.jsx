import React, { useState, useRef, useEffect } from 'react';

/**
 * LazyImage Component - Lazy loads images when they enter viewport
 * Uses Intersection Observer for efficient loading
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  return (
    <div 
      ref={imgRef} 
      className={`lazy-image-wrapper ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div 
          className="lazy-image-placeholder"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {placeholder || (
            <div className="lazy-image-spinner">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle 
                  cx="20" cy="20" r="16" 
                  stroke="rgba(0, 217, 255, 0.2)" 
                  strokeWidth="3"
                />
                <circle 
                  cx="20" cy="20" r="16" 
                  stroke="#00d9ff" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="80"
                  strokeDashoffset="60"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              </svg>
            </div>
          )}
        </div>
      )}
      
      {/* Actual image - only loads src when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in'
          }}
          {...props}
        />
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .lazy-image-wrapper {
          overflow: hidden;
        }
        .lazy-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
