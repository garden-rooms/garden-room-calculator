import { Configuration } from "../GardenRoomConfigurator";

interface CladdingStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const claddingOptions = [
  { id: "composite", name: "Composite Cladding" },
  { id: "cedar", name: "Cedar Cladding" },
  { id: "metal", name: "Metal Cladding" },
];

export function CladdingStep({ config, updateConfig, onNext, onPrev, priceData }: CladdingStepProps) {
  const getCladdingPrice = (type: string, wall: 'front' | 'sideRear') => {
    if (!priceData?.claddingCosts) return 0;
    
    if (wall === 'front') {
      if (type === 'composite') return priceData.claddingCosts.frontComposite;
      if (type === 'cedar') return priceData.claddingCosts.frontCedar;
      return 0; // Metal not available for front wall
    } else {
      if (type === 'composite') return priceData.claddingCosts.sideRearComposite;
      if (type === 'cedar') return priceData.claddingCosts.sideRearCedar;
      if (type === 'metal') return priceData.claddingCosts.sideRearMetal;
      return 0;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Cladding Options</h2>
      <p className="text-gray-600 mb-6">Choose cladding materials for different walls of your garden room.</p>
      
      <div className="space-y-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-[#20232A] mb-4">Front Wall Cladding</h3>
          <p className="text-sm text-gray-600 mb-4">
            Area: {priceData?.areas?.frontWallArea?.toFixed(1) || 0}m² (excludes door area)
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {claddingOptions.filter(option => option.id !== 'metal').map((option) => (
              <div
                key={option.id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${
                  config.frontCladding === option.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-gray-200 hover:border-[#D4AF37]"
                }`}
                onClick={() => updateConfig({ frontCladding: option.id })}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#20232A]">{option.name}</h4>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    config.frontCladding === option.id
                      ? "border-[#D4AF37] bg-[#D4AF37]"
                      : "border-gray-300"
                  }`} />
                </div>
                <p className="text-[#D4AF37] font-semibold text-sm">
                  £{getCladdingPrice(option.id, 'front').toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#20232A] mb-4">Side & Rear Wall Cladding</h3>
          <p className="text-sm text-gray-600 mb-4">
            Area: {priceData?.areas?.sideRearWallArea?.toFixed(1) || 0}m²
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {claddingOptions.map((option) => (
              <div
                key={option.id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${
                  config.sideRearCladding === option.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-gray-200 hover:border-[#D4AF37]"
                }`}
                onClick={() => updateConfig({ sideRearCladding: option.id })}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#20232A]">{option.name}</h4>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    config.sideRearCladding === option.id
                      ? "border-[#D4AF37] bg-[#D4AF37]"
                      : "border-gray-300"
                  }`} />
                </div>
                <p className="text-[#D4AF37] font-semibold text-sm">
                  £{getCladdingPrice(option.id, 'sideRear').toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
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
          View Summary
        </button>
      </div>
    </div>
  );
}
