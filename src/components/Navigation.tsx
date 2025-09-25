type Section = 'home' | 'printing' | 'shop' | 'repairs' | 'contact' | 'about' | 'clients';

interface NavigationProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <div className="fixed right-4 top-3/5 transform -translate-y-1/2 w-12 shadow-lg z-50">
      <button 
        onClick={() => setActiveSection('printing')}
        className={`bg-printing w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          activeSection === 'printing' ? 'ring-2 ring-white' : ''
        }`}
      >
        <span className="text-black text-[8px] font-bold font-mono">PRINTING</span>
      </button>
      <button 
        onClick={() => setActiveSection('shop')}
        className={`bg-shop w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          activeSection === 'shop' ? 'ring-2 ring-white' : ''
        }`}
      >
        <span className="text-black text-[8px] font-bold font-mono">SHOP</span>
      </button>
      <button 
        onClick={() => setActiveSection('repairs')}
        className={`bg-repairs w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          activeSection === 'repairs' ? 'ring-2 ring-white' : ''
        }`}
      >
        <span className="text-black text-[8px] font-bold font-mono">REPAIRS</span>
      </button>
      <button 
        onClick={() => setActiveSection('contact')}
        className={`bg-contact w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          activeSection === 'contact' ? 'ring-2 ring-white' : ''
        }`}
      >
        <span className="text-black text-[8px] font-bold font-mono">CONTACT</span>
      </button>
      <button 
        onClick={() => setActiveSection('about')}
        className={`bg-about w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          activeSection === 'about' ? 'ring-2 ring-white' : ''
        }`}
      >
        <span className="text-black text-[8px] font-bold font-mono">ABOUT</span>
      </button>
      <button 
        onClick={() => setActiveSection('clients')}
        className={`bg-clients w-12 h-12 flex items-end justify-center pb-1 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          activeSection === 'clients' ? 'ring-2 ring-white' : ''
        }`}
      >
        <span className="text-black text-[8px] font-bold font-mono">CLIENTS</span>
      </button>
      <div className="bg-gray-800 w-12 h-12"></div>
    </div>
  );
}