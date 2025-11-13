import { useEffect, useMemo, useState } from "react";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { cn } from "@/lib/utils";

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#14B8A6", "#0D9488", "#16B8A3", "#2DD4BF", "#0284c7", "#fafafa", "#5EEAD4"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
};

interface AnimatedTalkButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export const AnimatedTalkButton = ({ onClick, children }: AnimatedTalkButtonProps) => {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, []);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);

  return (
    <button
      className="group relative my-2 rounded-full bg-gradient-to-r from-teal-300/30 via-teal-500/30 via-40% to-teal-600/30 p-1 text-white transition-transform hover:scale-110 active:scale-105 w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-200 via-blue-300 via-40% to-medifly-teal-600 px-4 py-2 text-white">
        <Sparkle className="size-4 -translate-y-0.5 animate-sparkle fill-white" />
        <Sparkle
          style={{
            animationDelay: "1s",
          }}
          className="absolute bottom-2 left-3 z-20 size-1.5 rotate-12 animate-sparkle fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "1.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-4 top-2 size-1 -rotate-12 animate-sparkle fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "0.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-2.5 top-2.5 size-1.5 animate-sparkle fill-white"
        />

        <span className="font-medium text-sm">
          {children || "Talk with Aira"}
        </span>
      </div>
      {!!particleState && (
        <Particles
          id="aira-particles"
          className={cn("pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity", {
            "group-hover:opacity-100": particleState === "ready",
          })}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}
    </button>
  );
};

// For backward compatibility
export const Component = AnimatedTalkButton;