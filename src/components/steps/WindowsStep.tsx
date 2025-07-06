import { Configuration } from "../GardenRoomConfigurator";

interface WindowsStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function WindowsStep({ config, updateConfig, onNext, onPrev }: WindowsStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Windows</h2>
      <p className="text-gray-600 mb-6">Choose the quantity of each window type you'd like.</p>
      
      <div className="space-y-6 mb-8">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#20232A] mb-2">Aluminium Windows</h3>
              <p className="text-gray-600 text-sm">100×80cm aluminium frame windows</p>
              <p className="text-[#D4AF37] font-semibold mt-1">£500 each</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateConfig({ aluWindows: Math.max(0, config.aluWindows - 1) })}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{config.aluWindows}</span>
              <button
                onClick={() => updateConfig({ aluWindows: config.aluWindows + 1 })}
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
              <h3 className="font-semibold text-[#20232A] mb-2">UPVC Windows</h3>
              <p className="text-gray-600 text-sm">100×80cm UPVC frame windows</p>
              <p className="text-[#D4AF37] font-semibold mt-1">£280 each</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateConfig({ upvcWindows: Math.max(0, config.upvcWindows - 1) })}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{config.upvcWindows}</span>
              <button
                onClick={() => updateConfig({ upvcWindows: config.upvcWindows + 1 })}
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
              <h3 className="font-semibold text-[#20232A] mb-2">Roof Windows</h3>
              <p className="text-gray-600 text-sm">120×120cm roof-mounted skylights</p>
              <p className="text-[#D4AF37] font-semibold mt-1">£1,500 each</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateConfig({ roofWindows: Math.max(0, config.roofWindows - 1) })}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{config.roofWindows}</span>
              <button
                onClick={() => updateConfig({ roofWindows: config.roofWindows + 1 })}
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
          Next: Cladding
        </button>
      </div>
    </div>
  );
}
