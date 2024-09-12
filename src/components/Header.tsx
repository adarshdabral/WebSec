import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="bg-transparent text-gray-300 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* <Image src="/images/logo.svg" alt="Logo" width={40} height={40} /> */}
          <h1 className="text-2xl font-bold ml-2">WebSec</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-secondary-light">Home</a></li>
            <li><a href="#" className="hover:text-secondary-light">About</a></li>
            <li><a href="#" className="hover:text-secondary-light">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;