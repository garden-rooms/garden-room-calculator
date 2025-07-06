import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Configuration } from "../GardenRoomConfigurator";
import { toast } from "sonner";

interface SummaryStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function SummaryStep({ config, priceData, onPrev, onNext }: SummaryStepProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [requestSurvey, setRequestSurvey] = useState(false);
  
  const saveQuote = useMutation(api.quotes.saveQuote);

  const handleSaveQuote = async () => {
    if (!priceData) return;

    try {
      const quoteId = await saveQuote({
        customerName: customerInfo.name || undefined,
        customerEmail: customerInfo.email || undefined,
        customerPhone: customerInfo.phone || undefined,
        configuration: {
          length: config.length,
          depth: config.depth,
          floorArea: priceData.areas.floorArea,
          wallArea: priceData.areas.wallArea,
          roofArea: priceData.areas.roofArea,
          laminatedFloor: config.laminatedFloor,
          skimmedFinish: config.skimmedFinish,
          ceilingLights: config.ceilingLights,
          doubleSockets: config.doubleSockets,
          doorType: config.doorType,
          doorArea: priceData.areas.doorArea,
          windows: {
            aluWindows: config.aluWindows,
            upvcWindows: config.upvcWindows,
            roofWindows: config.roofWindows,
          },
          frontCladding: config.frontCladding,
          sideRearCladding: config.sideRearCladding,
        },
        priceBreakdown: priceData.breakdown,
        requestSurvey,
      });

      toast.success(
        requestSurvey 
          ? "Quote saved and survey requested! We'll contact you soon."
          : "Quote saved successfully!"
      );
    } catch (error) {
      toast.error("Failed to save quote. Please try again.");
    }
  };

  const handleDownloadPDF = () => {
    // Create a simple text-based quote for download
    const quoteText = `
GARDEN ROOM QUOTE
================

Configuration:
- Size: ${config.length}m × ${config.depth}m
- Floor Area: ${priceData?.areas?.floorArea}m²
- Wall Area: ${priceData?.areas?.wallArea}m²

Price Breakdown:
- Garden Room Shell (inc. fixed costs): £${priceData?.breakdown?.gardenRoomShell?.toLocaleString()}
- Interior & Flooring: £${(priceData?.breakdown?.laminatedFloor + priceData?.breakdown?.skimmedFinish)?.toLocaleString()}
- Electrical: £${priceData?.breakdown?.electricals?.toLocaleString()}
- Doors: £${priceData?.breakdown?.doors?.toLocaleString()}
- Windows: £${priceData?.breakdown?.windows?.toLocaleString()}
- Cladding: £${priceData?.breakdown?.cladding?.toLocaleString()}

Subtotal (ex VAT): £${priceData?.breakdown?.subtotal?.toLocaleString()}
VAT (20%): £${priceData?.breakdown?.vat?.toLocaleString()}
TOTAL (inc VAT): £${priceData?.breakdown?.total?.toLocaleString()}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([quoteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garden-room-quote-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!priceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Quote Summary</h2>
      
      <div className="bg-[#F5F5F5] rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-[#20232A] mb-4">Configuration Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Size:</strong> {config.length}m × {config.depth}m</p>
            <p><strong>Floor Area:</strong> {priceData.areas.floorArea}m²</p>
            <p><strong>Laminated Floor:</strong> {config.laminatedFloor ? "Yes" : "No"}</p>
            <p><strong>Skimmed Finish:</strong> {config.skimmedFinish ? "Yes" : "No"}</p>
          </div>
          <div>
            <p><strong>Ceiling Lights:</strong> {config.ceilingLights}</p>
            <p><strong>Double Sockets:</strong> {config.doubleSockets}</p>
            <p><strong>Windows:</strong> {config.aluWindows + config.upvcWindows + config.roofWindows} total</p>
            <p><strong>Door Type:</strong> {config.doorType.replace(/_/g, " ").toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-[#D4AF37] rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-[#20232A] mb-4">Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Garden Room Shell (inc. fixed costs):</span>
            <span>£{priceData.breakdown.gardenRoomShell.toLocaleString()}</span>
          </div>
          {priceData.breakdown.laminatedFloor > 0 && (
            <div className="flex justify-between">
              <span>Laminated Flooring:</span>
              <span>£{priceData.breakdown.laminatedFloor.toLocaleString()}</span>
            </div>
          )}
          {priceData.breakdown.skimmedFinish > 0 && (
            <div className="flex justify-between">
              <span>Skimmed Finish:</span>
              <span>£{priceData.breakdown.skimmedFinish.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Electrical:</span>
            <span>£{priceData.breakdown.electricals.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Doors:</span>
            <span>£{priceData.breakdown.doors.toLocaleString()}</span>
          </div>
          {priceData.breakdown.windows > 0 && (
            <div className="flex justify-between">
              <span>Windows:</span>
              <span>£{priceData.breakdown.windows.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Cladding:</span>
            <span>£{priceData.breakdown.cladding.toLocaleString()}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Subtotal (ex VAT):</span>
            <span>£{priceData.breakdown.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (20%):</span>
            <span>£{priceData.breakdown.vat.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#D4AF37]">
            <span>TOTAL (inc VAT):</span>
            <span>£{priceData.breakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-[#20232A] mb-4">Contact Information (Optional)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#F5F5F5] rounded-xl p-6 mb-8">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={requestSurvey}
            onChange={(e) => setRequestSurvey(e.target.checked)}
            className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
          />
          <span className="text-[#20232A] font-medium">Request an on-site survey</span>
        </label>
        <p className="text-sm text-gray-600 mt-2 ml-8">
          Our team will contact you to arrange a free site survey and provide a detailed quote.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <div className="space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#20232A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Download Quote
          </button>
          <button
            onClick={onNext}
            className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
          >
            Send Enquiry
          </button>
        </div>
      </div>
    </div>
  );
}
