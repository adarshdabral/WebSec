"use client";
import { cn } from "../../../lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chatbotResponse, setChatbotResponse] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>("");
  const [isSafari, setIsSafari] = useState<boolean>(false);

  const options = [
    { name: "Option 1", apiLink: "https://api.example1.com" },
    { name: "Option 2", apiLink: "https://api.example2.com" },
    { name: "Option 3", apiLink: "https://api.example3.com" },
    { name: "Option 4", apiLink: "https://api.example4.com" },
  ];

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure this runs only on the client

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = ctx.canvas.width = window.innerWidth;
    let h = ctx.canvas.height = window.innerHeight;
    let nt = 0;
    let animationId: number;

    ctx.filter = `blur(${blur}px)`;

    const render = () => {
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, w, h);

      const drawWave = (n: number) => {
        nt += getSpeed();
        const waveColors = colors ?? [
          "#38bdf8",
          "#818cf8",
          "#c084fc",
          "#e879f9",
          "#22d3ee",
        ];

        for (let i = 0; i < n; i++) {
          ctx.beginPath();
          ctx.lineWidth = waveWidth || 50;
          ctx.strokeStyle = waveColors[i % waveColors.length];
          for (let x = 0; x < w; x += 5) {
            const y = noise(x / 800, 0.3 * i, nt) * 100;
            ctx.lineTo(x, y + h * 0.5);
          }
          ctx.stroke();
          ctx.closePath();
        }
      };

      drawWave(5);
      animationId = requestAnimationFrame(render);
    };

    render();

    window.onresize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [blur, colors, waveWidth, backgroundFill, waveOpacity, speed]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSafari(
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue === "hi") {
      setShowOptions(true);
      setChatbotResponse("Please select an option:");
    } else {
      setShowOptions(false);
      setChatbotResponse("");
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setChatbotResponse(`You selected ${option}. Please enter a URL:`);
  };

  const handleUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedApiLink = options.find(opt => opt.name === selectedOption)?.apiLink;
    if (selectedApiLink) {
      try {
        const response = await fetch(selectedApiLink, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlInput }),
        });
        const data = await response.json();
        setChatbotResponse(`API Response: ${JSON.stringify(data)}`);
      } catch (error) {
        setChatbotResponse(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      ></canvas>
      
      <div className={cn("relative z-10 flex flex-col items-center", className)} {...props}>
        <h1 className="text-4xl font-bold text-white mb-4">
          Your Heading Here
        </h1>
        
        <PlaceholdersAndVanishInput
          placeholders={["Enter text...", "Try something new...", "Type 'hi' to start!"]}
          onChange={handleInputChange}
          onSubmit={(e) => e.preventDefault()}
        />
        
        {showOptions && (
          <div className="mt-4 flex space-x-2">
            {options.map((option) => (
              <button
                key={option.name}
                onClick={() => handleOptionSelect(option.name)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}

        {selectedOption && (
          <form onSubmit={handleUrlSubmit} className="mt-4">
            <input              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL"
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </form>
        )}
        
        {chatbotResponse && (
          <div className="mt-4 p-2 bg-white bg-opacity-20 rounded-lg">
            <p className="text-white">{chatbotResponse}</p>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};
