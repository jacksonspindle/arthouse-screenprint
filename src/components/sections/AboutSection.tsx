export default function AboutSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-about/10">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-about mb-6">ABOUT</h2>
        <p className="text-xl text-foreground/80 mb-8">
          Learn more about Arthouse Screen Print and Design Studio.
        </p>
        <div className="space-y-6 text-left">
          <div className="bg-white/80 p-6 rounded-lg">
            <h3 className="font-bold text-about mb-3">Our Story</h3>
            <p className="text-sm">Founded with a passion for bringing creative visions to life through high-quality screen printing and design services.</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg">
            <h3 className="font-bold text-about mb-3">Our Mission</h3>
            <p className="text-sm">To provide exceptional screen printing services that help businesses and individuals express their unique identity through custom apparel.</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg">
            <h3 className="font-bold text-about mb-3">Why Choose Us</h3>
            <p className="text-sm">Quality craftsmanship, attention to detail, and personalized service that exceeds expectations every time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}