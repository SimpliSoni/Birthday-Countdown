import React from 'react';

interface CountdownCardProps {
  value: number;
  label: string;
  animationDelay?: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ value, label, animationDelay }) => {
  const formattedValue = String(value).padStart(2, '0');

  return (
    <div 
      className="flex flex-col items-center justify-center w-28 h-28 sm:w-36 sm:h-36 animate-float"
      style={{ animationDelay }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background panel */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg"></div>
        
        {/* Glassmorphism effect */}
        <div className="absolute inset-0 bg-white/20 rounded-2xl border border-white/30"></div>
        
        <div className="relative z-10 text-center">
          <span 
            key={`${label}-${value}`} 
            className="text-4xl sm:text-6xl font-bold text-gray-800 tracking-wider transition-opacity duration-300"
          >
            {formattedValue}
          </span>
        </div>
      </div>
      <span className="mt-3 text-sm sm:text-base font-light text-gray-700 uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default CountdownCard;
