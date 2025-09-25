export default function ContactSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-contact/10">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-contact mb-6">CONTACT</h2>
        <p className="text-xl text-foreground/80 mb-8">
          Get in touch with our team for your screen printing needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-contact mb-3">Phone</h3>
            <p className="text-sm">(555) 123-4567</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-contact mb-3">Email</h3>
            <p className="text-sm">hello@arthouse-print.com</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-contact mb-3">Address</h3>
            <p className="text-sm">123 Design Street<br />Art District, AD 12345</p>
          </div>
          <div className="bg-white/80 p-6 rounded-lg text-left">
            <h3 className="font-bold text-contact mb-3">Hours</h3>
            <p className="text-sm">Mon-Fri: 9AM-6PM<br />Sat: 10AM-4PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}