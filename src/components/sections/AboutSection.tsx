export default function AboutSection() {
  return (
    <div className="h-full flex flex-col items-start justify-start pt-24 pl-8">
      <div className="text-left max-w-2xl">
        <div className="text-lg italic leading-relaxed transition-colors duration-200" style={{ fontFamily: 'serif', color: 'var(--foreground)' }}>
          <p className="mb-4">
            ARTHOUSE is a screen printing and design studio founded in 2024 by Addie Rodenberger and Oscar Landry.
          </p>
          <p>
            BROOKLYN, NY
          </p>
        </div>
      </div>
    </div>
  );
}