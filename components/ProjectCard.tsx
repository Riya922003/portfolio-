"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface ProjectCardProps {
  name: string;
  description: string;
  tech: string[];
  link: string;
  image?: string;
  gifPath?: string;
}

export default function ProjectCard({
  name,
  description,
  tech,
  link,
  image,
  gifPath,
}: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  
  // Paths and type detection
  const staticImage = image || "/assets/images/placeholder.png";
  const staticIsGif = !!staticImage.toLowerCase().endsWith(".gif");

  // Prefer explicit gifPath; if missing and staticImage is a GIF, use that GIF for hover only.
  const hoverGif = gifPath || (staticIsGif ? staticImage : "/assets/gif/placeholder.gif");
  const hoverIsVideo = !!hoverGif.toLowerCase().endsWith(".mp4");

  return (
    <div className="w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card rounded-md shadow-xl mx-auto flex flex-col justify-between p-4 border border-transparent dark:border-neutral-800",
          // Set wider card dimensions to accommodate landscape GIFs
          "h-[400px] w-full",
          "transition-all duration-500"
        )}
        onMouseEnter={() => {
          setIsHovering(true);
          setGifKey(prev => prev + 1); // Force GIF reload to restart animation
        }}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background: show static preview by default. Only mount/play GIF or video on hover. */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          {/* Render the static image (even if it's a GIF) so animated GIFs autoplay by default. */}
          <img
            src={staticImage}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isHovering ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Render GIF/MP4 preview and autoplay it by default (not only on hover). */}
          {hoverIsVideo ? (
            <video
              key={gifKey}
              src={hoverGif}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              loop
              autoPlay
            />
          ) : (
            <img
              key={gifKey}
              src={hoverGif}
              alt={`${name} demo`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                // keep staticImage visible when there's no gif; when gif is same as staticImage the gif will show by default
                staticIsGif ? "" : ""
              )}
            />
          )}
        </div>

        {/* Dark overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-500 z-10",
            isHovering ? "opacity-50" : "opacity-0"
          )}
        />
        {/* Bottom info panel: semi-opaque, slides up / expands on hover. Tap toggles on mobile. */}
        <div
          role="group"
          aria-label={`${name} summary`}
          onClick={() => setIsHovering((s) => !s)}
          className={cn(
            "absolute left-4 right-4 bottom-4 z-30 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm",
            // background opacity + subtle border to match card style
            "bg-black/55 border border-white/5",
            // collapsed vs expanded state (slide-up effect + max-height to animate)
            isHovering ? "translate-y-0 max-h-72" : "translate-y-6 max-h-28"
          )}
          style={{ overflow: "hidden" }}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {tech.slice(0, 4).map((t, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-neutral-800/80 text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-bold text-lg md:text-xl text-gray-50 mb-2">{name}</h1>

          <p className={cn("text-sm text-gray-200 transition-all", isHovering ? "max-h-[480px]" : "max-h-16 line-clamp-3")}>
            {description}
          </p>

          <div className="mt-3">
            <a
              href={link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-100"
            >
              View Project →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
