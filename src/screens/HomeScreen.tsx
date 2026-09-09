import React from 'react';
import { CollageHero } from '../components/CollageHero';

interface HomeScreenProps {
  onStartTest: () => void;
  onOpenScannerDialog?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStartTest,
  onOpenScannerDialog 
}) => {
  return (
    <div 
      id="screen-home"
      className="w-full h-full bg-[#FAF2F0] flex flex-col items-center justify-between px-5 pt-[26px] pb-0 select-none overflow-hidden"
    >
      {/* 1. Header Typography Area */}
      <div className="w-full flex flex-col items-center shrink-0">
        <h1 
          id="home-title-line-1"
          className="text-[23px] sm:text-[24px] leading-[30px] font-bold text-[#201A19] tracking-tight text-center font-serif whitespace-nowrap"
          style={{
            fontVariationSettings: "'opsz' 36, 'wght' 750"
          }}
        >
          BLOOD GROUP DETECTION
        </h1>

        <h2 
          id="home-title-line-2"
          className="text-[23px] sm:text-[24px] leading-[30px] font-bold text-[#201A19] tracking-tight text-center font-serif whitespace-nowrap"
          style={{
            fontVariationSettings: "'opsz' 36, 'wght' 750"
          }}
        >
          USING FINGERPRINTS
        </h2>
      </div>

      {/* Exact Balanced Spacer: Gap between Title and Image = Gap between Nav Bar and Title (26px) */}
      <div className="h-[26px] shrink-0" />

      {/* 2. Middle Hero Image (Central Artwork matching 8.png height) */}
      <div className="w-full flex items-center justify-center shrink-0">
        <CollageHero 
          customImageUri="/8.png"
        />
      </div>

      {/* Fixed Gap: Preserves the exact position of the description text */}
      <div className="h-[28px] shrink-0" />

      {/* 3. Centered Descriptive Instruction Text (position strictly fixed) */}
      <div className="w-full flex flex-col items-center text-center px-2 shrink-0">
        <p 
          id="home-desc-line-1"
          className="text-[17px] leading-[23px] text-[#524440] font-serif font-normal"
        >
          Upload fingerprint image to get your
        </p>

        <p 
          id="home-desc-line-2"
          className="text-[17px] leading-[23px] text-[#524440] font-serif font-normal"
        >
          predicted Blood Group
        </p>
      </div>

      {/* 4. Balanced Lower Action Zone: Centers 'Test Now' so gap above and gap below to bottom nav bar are identical */}
      <div className="flex-1 w-full flex flex-col items-center justify-center shrink-0">
        <button
          id="btn-test-now"
          onClick={onStartTest}
          className="w-[308px] h-[52px] rounded-full bg-[#8A0000] hover:bg-[#A2240B] text-[#FFFFFF] text-[17px] font-bold tracking-wide shadow-md active:scale-[0.98] transition-all duration-150 flex items-center justify-center cursor-pointer font-serif"
          style={{
            fontVariationSettings: "'opsz' 24, 'wght' 700",
            boxShadow: '0 4px 14px rgba(138, 0, 0, 0.28)'
          }}
          aria-label="Test Now"
        >
          Test Now
        </button>
      </div>
    </div>
  );
};
