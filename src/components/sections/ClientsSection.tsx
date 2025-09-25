export default function ClientsSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-clients/10">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-clients mb-6">CLIENTS</h2>
        <p className="text-xl text-foreground/80 mb-8">
          Discover our portfolio and satisfied customer testimonials.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-clients mb-3">Local Businesses</h3>
            <p className="text-sm">Helping local companies build their brand with custom apparel</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-clients mb-3">Events & Teams</h3>
            <p className="text-sm">Custom merchandise for sports teams, events, and organizations</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-clients mb-3">Artists & Designers</h3>
            <p className="text-sm">Bringing creative visions to life through screen printing</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-clients mb-3">Testimonials</h3>
            <p className="text-sm">"Exceptional quality and service. Highly recommended!" - Local Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}