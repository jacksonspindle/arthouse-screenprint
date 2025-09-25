export default function RepairsSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-repairs/10">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-repairs mb-6">REPAIRS</h2>
        <p className="text-xl text-foreground/80 mb-8">
          Professional garment and screen repair services to extend the life of your apparel.
        </p>
        <div className="space-y-4">
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-repairs mb-3">Screen Repairs</h3>
            <p className="text-sm">Fix damaged screens and extend their usable life</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-repairs mb-3">Garment Restoration</h3>
            <p className="text-sm">Restore faded or damaged printed apparel</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-repairs mb-3">Equipment Maintenance</h3>
            <p className="text-sm">Keep your printing equipment running smoothly</p>
          </div>
        </div>
      </div>
    </div>
  );
}