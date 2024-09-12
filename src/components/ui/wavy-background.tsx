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
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const options = [
    { name: "SQL Injection", apiLink: "https://deka.pylex.xyz:10037/sqlscan" },
    { name: "XSS", apiLink: "http://deka.pylex.xyz:10037/xss" },
    { name: "Weak Password", apiLink: "http://deka.pylex.xyz:10037/password" },
    { name: "Website Strss", apiLink: "http://deka.pylex.xyz:10037/xss" },
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

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
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
    setChatbotResponse(`You selected ${option}. Please enter a URL:`);
    setSelectedOption(option);
    
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
          WebSec
        </h1>
        <h6>Webiste Security Scanner</h6>
        <br />
        
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
                className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white rounded hover:bg-blue-600 transition-colors"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}

        {selectedOption && (
          <form onSubmit={handleUrlSubmit} className="mt-4">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL"
              className="px-4 py-2 rounded bg-white bg-opacity-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white rounded hover:bg-green-600 transition-colors"
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