export default function ShopSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-shop/10">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-shop mb-6">SHOP</h2>
        <p className="text-xl text-foreground/80 mb-8">
          Browse our collection of custom designs and premium apparel.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/80 p-4 rounded-lg aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-shop/30 rounded mb-2 mx-auto"></div>
              <span className="text-sm font-medium">Design #1</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-lg aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-shop/30 rounded mb-2 mx-auto"></div>
              <span className="text-sm font-medium">Design #2</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-lg aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-shop/30 rounded mb-2 mx-auto"></div>
              <span className="text-sm font-medium">Design #3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}