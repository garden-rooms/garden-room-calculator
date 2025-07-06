import { AnimatedPrice } from "./AnimatedPrice";

interface PriceDisplayProps {
  priceData: any;
}

export function PriceDisplay({ priceData }: PriceDisplayProps) {
  if (!priceData) {
    return (
      <div className="bg-[#F5F5F5] rounded-xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] rounded-xl p-6 mb-6 sticky top-4 z-10">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm">Current Price (ex VAT)</p>
          <p className="text-2xl font-bold text-[#20232A]">
            <AnimatedPrice value={priceData.breakdown.subtotal} />
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-sm">Total inc VAT</p>
          <p className="text-3xl font-bold text-[#D4AF37]">
            <AnimatedPrice value={priceData.breakdown.total} />
          </p>
        </div>
      </div>
    </div>
  );
}
