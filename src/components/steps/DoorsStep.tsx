import { Configuration } from "../GardenRoomConfigurator";

interface DoorsStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const doorOptions = [
  { id: "upvc_french_180", name: "UPVC French Doors", width: "180cm", price: 1450 },
  { id: "upvc_french_240", name: "UPVC French + Side Panels", width: "240cm", price: 1600 },
  { id: "upvc_sliding_200", name: "UPVC Sliding Doors", width: "200cm", price: 1200 },
  { id: "alu_sliding_200", name: "Aluminium Sliding Doors", width: "200cm", price: 1900 },
  { id: "alu_bifold_200", name: "Aluminium Bi-fold Doors", width: "200cm", price: 1800 },
  { id: "alu_bifold_300", name: "Aluminium Bi-fold Doors", width: "300cm", price: 2500 },
  { id: "upvc_sliding_400", name: "UPVC Sliding with Panels", width: "400cm", price: 2150 },
];

export function DoorsStep({ config, updateConfig, onNext, onPrev }: DoorsStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Choose Your Door</h2>
      <p className="text-gray-600 mb-6">Select one door type for your garden room. Door fitting (£460) is included.</p>
      
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {doorOptions.map((door) => (
          <div
            key={door.id}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:scale-105 ${
              config.doorType === door.id
                ? "border-[#D4AF37] bg-[#D4AF37]/5"
                : "border-gray-200 hover:border-[#D4AF37]"
            }`}
            onClick={() => updateConfig({ doorType: door.id })}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#20232A]">{door.name}</h3>
              <div className={`w-4 h-4 rounded-full border-2 ${
                config.doorType === door.id
                  ? "border-[#D4AF37] bg-[#D4AF37]"
                  : "border-gray-300"
              }`} />
            </div>
            <p className="text-gray-600 text-sm mb-2">Width: {door.width}</p>
            <p className="text-[#D4AF37] font-semibold">£{door.price.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#F5F5F5] rounded-xl p-4 mb-8">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Door fitting cost of £460 is automatically included in your quote.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
        >
          Next: Windows
        </button>
      </div>
    </div>
  );
}
