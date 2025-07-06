import { Configuration } from "../GardenRoomConfigurator";

interface InteriorStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function InteriorStep({ config, updateConfig, onNext, onPrev }: InteriorStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Interior & Flooring Options</h2>
      
      <div className="space-y-6 mb-8">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#D4AF37] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#20232A] mb-2">Laminated Flooring</h3>
              <p className="text-gray-600 text-sm">High-quality laminated flooring throughout</p>
              <p className="text-[#D4AF37] font-semibold mt-1">
                +£{((config.length * config.depth) * 55).toLocaleString()}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.laminatedFloor}
                onChange={(e) => updateConfig({ laminatedFloor: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#D4AF37] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#20232A] mb-2">Skimmed & Painted Finish</h3>
              <p className="text-gray-600 text-sm">Professional skimmed walls and ceiling with paint finish</p>
              <p className="text-[#D4AF37] font-semibold mt-1">
                +£{(((2 * (config.length * 2.4) + 2 * (config.depth * 2.4)) + (config.length * config.depth)) * 70).toLocaleString()}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.skimmedFinish}
                onChange={(e) => updateConfig({ skimmedFinish: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
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
          Next: Electrical
        </button>
      </div>
    </div>
  );
}
