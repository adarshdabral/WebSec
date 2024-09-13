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
  let w: number, h: number, nt: number, i: number, x: number, ctx: any, canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [urlInput, setUrlInput] = useState("");
  
  // List of options with respective API links
  const options = [
    { name: "SQL Injection", apiLink: "http://deka.pylex.xyz:10037/sqlscan" },
    { name: "XSS", apiLink: "http://deka.pylex.xyz:10037/xss" },
    { name: "Weak Password", apiLink: "http://deka.pylex.xyz:10037/password" },
    { name: "Website Stress", apiLink: "http://deka.pylex.xyz:10037/webstresser" },
    { name: "Deface Attack", apiLink: "http://deka.pylex.xyz:10037/deface" },
    { name: "Info Gathering", apiLink: "http://deka.pylex.xyz:10037/basicscan" },
    { name: "DNS Records", apiLink: "http://deka.pylex.xyz:10037/dnsrecord" },
    { name: "Complete Scan", apiLink: "http://deka.pylex.xyz:10037/fullscan" },
  ];

  // Initialize the canvas with the wave background
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

  const getSpeed = () => {
    return speed === "fast" ? 0.002 : 0.001;
  };
  const waveColors = colors ?? [
    "#38bdf8", // Light Blue
    "#818cf8", // Purple
    "#c084fc", // Light Purple
    "#e879f9", // Pink
    "#22d3ee", // Teal
  ];
  
  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];  // Updated to use waveColors
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

  // Handle chatbot input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setChatbotResponse("Hey I'm WebSec!");
      setShowOptions(true);
    // if (inputValue === " ") {
    //   setChatbotResponse("Hey I'm WebSec!");
    //   setShowOptions(true);
    // } else {
    //   setShowOptions(false);
    //   setChatbotResponse("");
    // }
  };

  // Handle the option selection and make initial API call
  const handleOptionSelect = async (option: string) => {
    setSelectedOption(option);
    const selectedApiLink = options.find(opt => opt.name === option)?.apiLink;

    if (selectedApiLink) {
      try {
        // Make the initial API request when option is selected
        const response = await fetch(selectedApiLink, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.text();
        if (response.ok) {
          setChatbotResponse(`You selected ${option}. Please enter a URL.`);
        } else {
          setChatbotResponse(`How can I help you?`);

        }
      } catch (error) {
        setChatbotResponse(`Error: ${error.message}`);
      }
    }
  };

  // Handle URL submission and send it to the selected API
  const handleUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedApiLink = options.find(opt => opt.name === selectedOption)?.apiLink;
  
    if (selectedApiLink) {
      try {
        // Send the URL to the API in JSON format
        const response = await fetch(selectedApiLink, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ website: urlInput }), // URL as JSON payload
        });
  
        const data = await response.text();
        const gfg = document.createElement('a');
        
       
        if (response.ok) {
          setChatbotResponse(`API Response: ${data}`);
        } 
        else if(response.status == 500)
        {
          setChatbotResponse(`This method didn't respond due to server issue.`);
        }
        else {
          setChatbotResponse(`Error is: ${response.statusText}. `);
          
        }
      } catch (error) {
        setChatbotResponse(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className={cn("h-screen flex flex-col items-center justify-center", containerClassName)}>
      <canvas className="absolute inset-0 z-0" ref={canvasRef} id="canvas"></canvas>

      <div className={cn("relative z-10 flex flex-col items-center", className)} {...props}>
        <h1 className="text-7xl font-bold text-white mb-4">WebSec</h1>
        <h6 className="text-xl" >Website Security Scanner</h6>
        <br />

        {/* <PlaceholdersAndVanishInput
          placeholders={["Enter text...", "Try something new...", "Type 'hi' to start!"]}
          onChange={handleInputChange}
          onSubmit={(e) => e.preventDefault()}
        /> */}

        {chatbotResponse && (
          <div className="mt-4 p-2 bg-white bg-opacity-20 rounded-lg">
            <p className="text-white">{chatbotResponse}</p>
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

        {children}
      </div>
    </div>
  );
};
