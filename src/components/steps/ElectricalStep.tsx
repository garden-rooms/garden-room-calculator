import { Configuration } from "../GardenRoomConfigurator";

interface ElectricalStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function ElectricalStep({ config, updateConfig, onNext, onPrev }: ElectricalStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Electrical Options</h2>
      
      <div className="space-y-6 mb-8">
        <div className="bg-[#F5F5F5] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#20232A] mb-2">Consumer Unit</h3>
              <p className="text-gray-600 text-sm">Essential electrical distribution unit (always included)</p>
            </div>
            <div className="text-[#D4AF37] font-semibold">£230</div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#20232A] mb-2">Ceiling Downlights</h3>
              <p className="text-gray-600 text-sm">LED downlights for ceiling illumination</p>
              <p className="text-[#D4AF37] font-semibold mt-1">£70 each</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateConfig({ ceilingLights: Math.max(0, config.ceilingLights - 1) })}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{config.ceilingLights}</span>
              <button
                onClick={() => updateConfig({ ceilingLights: config.ceilingLights + 1 })}
                className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center hover:bg-[#B8941F] transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#20232A] mb-2">Double Sockets</h3>
              <p className="text-gray-600 text-sm">13A double electrical sockets</p>
              <p className="text-[#D4AF37] font-semibold mt-1">£115 each</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateConfig({ doubleSockets: Math.max(0, config.doubleSockets - 1) })}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{config.doubleSockets}</span>
              <button
                onClick={() => updateConfig({ doubleSockets: config.doubleSockets + 1 })}
                className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center hover:bg-[#B8941F] transition-colors"
              >
                +
              </button>
            </div>
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
          Next: Doors
        </button>
      </div>
    </div>
  );
}
