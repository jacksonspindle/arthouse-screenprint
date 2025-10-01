import Image from 'next/image';

type Section = 'home' | 'printing' | 'shop' | 'repairs' | 'contact' | 'about' | 'clients';

interface NavigationProps {
  setActiveSection: (section: Section) => void;
}

export default function Navigation({ setActiveSection }: NavigationProps) {
  return (
    <div className="fixed right-4 top-3/5 transform -translate-y-1/2 w-12 shadow-lg z-50">
      <button 
        onClick={() => setActiveSection('printing')}
        className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto"
        style={{ backgroundColor: '#00ABED' }}
      >
        <span className="text-black text-[8px]" style={{ fontFamily: 'Courier, monospace' }}>PRINTING</span>
      </button>
      <button 
        onClick={() => setActiveSection('shop')}
        className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto"
        style={{ backgroundColor: '#EA008A' }}
      >
        <span className="text-black text-[8px]" style={{ fontFamily: 'Courier, monospace' }}>SHOP</span>
      </button>
      <button 
        onClick={() => setActiveSection('repairs')}
        className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto"
        style={{ backgroundColor: '#FFF000' }}
      >
        <span className="text-black text-[8px]" style={{ fontFamily: 'Courier, monospace' }}>REPAIRS</span>
      </button>
      <button 
        onClick={() => setActiveSection('contact')}
        className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto"
        style={{ backgroundColor: '#2E3090' }}
      >
        <span className="text-black text-[8px]" style={{ fontFamily: 'Courier, monospace' }}>CONTACT</span>
      </button>
      <button 
        onClick={() => setActiveSection('about')}
        className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto"
        style={{ backgroundColor: '#EC1D25' }}
      >
        <span className="text-black text-[8px]" style={{ fontFamily: 'Courier, monospace' }}>ABOUT</span>
      </button>
      <button 
        onClick={() => setActiveSection('clients')}
        className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto"
        style={{ backgroundColor: '#00A451' }}
      >
        <span className="text-black text-[8px]" style={{ fontFamily: 'Courier, monospace' }}>CLIENTS</span>
      </button>
      <button 
        onClick={() => setActiveSection('home')}
        className="bg-gray-800 w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-105 pointer-events-auto"
      >
        <Image
          src="/ArtHouseIcon.png"
          alt="ArtHouse Icon"
          width={32}
          height={32}
          className="object-contain"
        />
      </button>
    </div>
  );
}