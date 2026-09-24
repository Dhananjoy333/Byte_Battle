'use client';

import React, {
  useEffect,
  useRef,
  useState,
  VideoHTMLAttributes,
} from 'react';

export interface LazyVideoProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string;
  fallbackSrc?: string;
  containerClassName?: string;
  preloadMargin?: string;
  playbackMargin?: string;
}

export default function LazyVideo({
  src,
  fallbackSrc,
  className = '',
  containerClassName = '',
  preloadMargin = '300px 0px',
  playbackMargin = '50px 0px',
  loop = true,
  muted = true,
  playsInline = true,
  onLoadedData,
  onError,
  ...rest
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync src if prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // 1. Preload Observer: starts buffering video slightly ahead of entering viewport
  useEffect(() => {
    if (shouldLoad) return;
    const container = containerRef.current;
    if (!container) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const loadObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      {
        rootMargin: preloadMargin,
      }
    );

    loadObserver.observe(container);

    return () => {
      loadObserver.disconnect();
    };
  }, [shouldLoad, preloadMargin]);

  // 2. Playback Observer: plays video when in viewport, pauses when scrolled away
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      {
        rootMargin: playbackMargin,
        threshold: 0.1,
      }
    );

    playbackObserver.observe(container);

    return () => {
      playbackObserver.disconnect();
    };
  }, [playbackMargin]);

  // 3. Playback control
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isInView) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Playback interruption or browser autoplay policy handled safely
        });
      }
    } else {
      video.pause();
    }
  }, [shouldLoad, isInView, isLoaded]);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsLoaded(true);
    if (isInView && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
    if (onLoadedData) {
      onLoadedData(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-neutral-900 ${containerClassName}`}
    >
      {/* Sleek dark shimmer placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900" />
      )}

      {/* Styled fallback if video cannot load */}
      {hasError && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-neutral-900">
          <div className="size-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-blue-500 to-transparent" />
        </div>
      )}

      <video
        ref={videoRef}
        src={shouldLoad ? currentSrc : undefined}
        preload="none"
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        className={`size-full object-cover object-center transition-opacity duration-700 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoadedData={handleLoadedData}
        onError={handleError}
        {...rest}
      />
    </div>
  );
}
