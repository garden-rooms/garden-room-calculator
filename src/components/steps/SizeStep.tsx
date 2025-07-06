import { Configuration } from "../GardenRoomConfigurator";

interface SizeStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function SizeStep({ config, updateConfig, onNext }: SizeStepProps) {
  const handleLengthChange = (length: number) => {
    updateConfig({ length });
  };

  const handleDepthChange = (depth: number) => {
    updateConfig({ depth });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Choose Your Garden Room Size</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Length (Front Wall) - {config.length}m
          </label>
          <input
            type="range"
            min="3"
            max="8"
            step="0.5"
            value={config.length}
            onChange={(e) => handleLengthChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3m</span>
            <span>8m</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Depth (Side Wall) - {config.depth}m
          </label>
          <input
            type="range"
            min="2.5"
            max="6"
            step="0.5"
            value={config.depth}
            onChange={(e) => handleDepthChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2.5m</span>
            <span>6m</span>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5F5] rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-[#20232A] mb-4">Calculated Dimensions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Floor Area:</span>
            <p className="font-semibold">{(config.length * config.depth).toFixed(1)}m²</p>
          </div>
          <div>
            <span className="text-gray-600">Wall Height:</span>
            <p className="font-semibold">2.4m</p>
          </div>
          <div>
            <span className="text-gray-600">Wall Area:</span>
            <p className="font-semibold">{(2 * (config.length * 2.4) + 2 * (config.depth * 2.4)).toFixed(1)}m²</p>
          </div>
          <div>
            <span className="text-gray-600">Roof Area:</span>
            <p className="font-semibold">{((config.length + 0.8) * (config.depth + 0.8)).toFixed(1)}m²</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
        >
          Next: Interior Options
        </button>
      </div>
    </div>
  );
}
