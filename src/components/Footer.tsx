import Image from 'next/image';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 z-50 pointer-events-none">
      {/* Bottom Crosshair */}
      <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <Image
          src="/Crosshair.svg"
          alt="Crosshair"
          width={48}
          height={48}
          className="w-12 h-12"
        />
      </div>
      
      {/* Bottom Corner Elements */}
      <div className="absolute bottom-5 left-4">
        <Image
          src="/Sprial.png"
          alt="Spiral"
          width={32}
          height={32}
          className="w-9 h-9"
          style={{ filter: 'brightness(0.3) opacity(0.3)' }}
        />
        {/* Line above bottom-left spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute -top-6 left-5 transform -translate-x-1/2 w-9 h-0.5"
          style={{ filter: 'brightness(0.3)  opacity(0.4)' }}
        />
        {/* Vertical line to the right of bottom-left spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute top-1/2 left-12 transform -translate-y-1/2 rotate-90 w-9 h-0.5"
          style={{ filter: 'brightness(0.3)  opacity(0.4) ' }}
        />
      </div>
      
      <div className="absolute bottom-5 right-4">
        <Image
          src="/Sprial.png"
          alt="Spiral"
          width={32}
          height={32}
          className="w-9 h-9"
          style={{ filter: 'brightness(0.3) opacity(0.4)' }}
        />
        {/* Line above bottom-right spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-9 h-0.5"
          style={{ filter: 'brightness(0.3) opacity(0.4)'}}
        />
        {/* Vertical line to the left of bottom-right spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 rotate-90 w-9 h-0.5"
          style={{ filter: 'brightness(0.3)  opacity(0.4)' }}
        />
      </div>
      
      {/* Bottom Black to White Gradient Boxes */}
      <div className="absolute bottom-7.5 left-1/2 transform -translate-x-1/2 flex ml-3">
        <div className="w-4 h-4 bg-black"></div>
        <div className="w-4 h-4 bg-gray-900"></div>
        <div className="w-4 h-4 bg-gray-800"></div>
        <div className="w-4 h-4 bg-gray-700"></div>
        <div className="w-4 h-4 bg-gray-600"></div>
        <div className="w-4 h-4 bg-gray-500"></div>
        <div className="w-4 h-4 bg-gray-400"></div>
        <div className="w-4 h-4 bg-gray-300"></div>
        <div className="w-4 h-4 bg-gray-200"></div>
        <div className="w-4 h-4 bg-white"></div>
      </div>
    </div>
  );
}