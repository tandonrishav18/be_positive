import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#E9E1DF] flex flex-col items-center justify-center p-0 sm:py-4 overflow-x-hidden">
      {/* Target 412 × 892 Viewport Container */}
      <div 
        id="app-container"
        className="w-[412px] h-[892px] max-w-full bg-[#FAF2F0] flex flex-col relative overflow-hidden sm:rounded-[24px] sm:shadow-2xl sm:border border-[#D4C3BF] shrink-0"
        style={{
          width: '412px',
          height: '892px',
          boxSizing: 'border-box'
        }}
      >
        {/* Primary Screen Area */}
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};

