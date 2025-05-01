import React from 'react';

export default function Footer() {
  return (
    <footer className="flex justify-center items-center p-4 bg-gray-800 text-white">
      <p>&copy; {new Date().getFullYear()} Pictures Generator</p>
    </footer>
  );
}
