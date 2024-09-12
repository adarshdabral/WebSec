import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScanForm from '../components/ScanForm';
import ResultsDisplay from '../components/ResultsDisplay';
import { ScanResults } from '../types';
import { motion } from 'framer-motion';
import Chatbot from '../components/Chatbot';
import { WavyBackground } from '@/components/ui/wavy-background';
import  WavyBackgroundWithChatbot  from '@/components/ui/WavyBackgroundWithChatBot';
import { LampContainer } from '@/components/ui/lamp';
import TestCompo from '../components/TestCompo';
import { PlaceholdersAndVanishInput } from '../components/ui/placeholders-and-vanish-input';

const handleMessageSubmit = (message: string): string => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.startsWith('hi') || normalizedMessage.startsWith('hello')) {
    return 'Hey there! I\'m WebSec. How can I help you today?';
  } else if (normalizedMessage.includes('weather')) {
    return 'Sorry, I cannot provide weather information yet.';
  } else if (normalizedMessage.includes('help')) {
    return 'I can help you with [list of things your chatbot can do]. Just ask me!';
  } else {
    return 'I\'m still learning. Could you please rephrase your question?';
  }
};

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a JavaScript method to reverse a string",
  "How to assemble your own PC?",
];

const Home: React.FC = () => {
  const [scanResults, setScanResults] = useState<ScanResults | { error: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Head>
        <title>WebSecurityScanner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

    
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        {/* <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
          WebSec
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
          Website Security Scanner
        </p> */}
     
      </WavyBackground>

     

      
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mb-8 bg-gradient-to-br from-slate-300 to-slate-500 py-0 bg-clip-text text-center text-4xl font-medium tracking-tight text-white md:text-xl"
        >
          <ScanForm onScanComplete={setScanResults} />
        </motion.h1>
      </LampContainer>

      <ResultsDisplay results={scanResults} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-blue-400"></h1>
          <p className="text-xl text-gray-400"></p>
        </div>
      </main>

      <br /><br />

     
      <Footer />
    </div>
  );
};

export default Home;



{/* <div className="h-[40rem] flex flex-col justify-center items-center px-4">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
          Ask Aceternity UI Anything
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div> */}
