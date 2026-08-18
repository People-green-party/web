"use client";

import React from "react";

type Props = {
  src: string;
  alt: string;
  /** Tailwind classes for the image (object-cover etc.) */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** object-position e.g. "center 30%" */
  objectPosition?: string;
};

/**
 * Internship assets from /public — plain <img> so Next image optimizer /
 * Turbopack workspace-root quirks can't blank them. Files are already
 * JPEG-compressed on disk. Parent must be `relative` with size / aspect.
 */
export function InternshipImage({
  src,
  alt,
  className = "object-cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  objectPosition,
}: Props) {
  const cleanSrc = src.split("?")[0];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cleanSrc}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}
