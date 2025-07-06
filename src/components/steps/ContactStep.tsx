import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Configuration } from "../GardenRoomConfigurator";
import { toast } from "sonner";

interface ContactStepProps {
  config: Configuration;
  updateConfig: (updates: Partial<Configuration>) => void;
  priceData: any;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function ContactStep({ config, priceData, onPrev }: ContactStepProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const sendEmail = useAction(api.email.sendEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
      toast.error("Please fill in your name and email address");
      return;
    }

    if (!priceData) {
      toast.error("Price data not available. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendEmail({
        customerName: customerInfo.name.trim(),
        customerEmail: customerInfo.email.trim(),
        customerPhone: customerInfo.phone.trim() || undefined,
        message: customerInfo.message.trim() || undefined,
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
      });

      setIsSubmitted(true);
      toast.success("Thank you! Your enquiry has been sent. We'll get back to you soon.");
    } catch (error) {
      console.error("Failed to send enquiry:", error);
      toast.error("Failed to send enquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    const quoteText = `
GARDEN ROOM QUOTE
================

Configuration:
- Size: ${config.length}m × ${config.depth}m
- Floor Area: ${priceData?.areas?.floorArea}m²
- Wall Area: ${priceData?.areas?.wallArea}m²

Interior Options:
- Laminated Floor: ${config.laminatedFloor ? 'Yes' : 'No'}
- Skimmed Finish: ${config.skimmedFinish ? 'Yes' : 'No'}

Electrical:
- Ceiling Lights: ${config.ceilingLights}
- Double Sockets: ${config.doubleSockets}

Doors & Windows:
- Door Type: ${config.doorType.replace(/_/g, " ").toUpperCase()}
- ALU Windows: ${config.aluWindows}
- UPVC Windows: ${config.upvcWindows}
- Roof Windows: ${config.roofWindows}

Cladding:
- Front: ${config.frontCladding}
- Side/Rear: ${config.sideRearCladding}

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
Quality Outdoor Rooms
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

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#20232A] mb-4">Enquiry Sent Successfully!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for your interest in our garden rooms. We've received your enquiry and will get back to you within 24 hours.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#20232A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mr-4"
          >
            Download Quote Summary
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
          >
            Configure Another Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#20232A] mb-6">Contact & Send Quote</h2>
      <p className="text-gray-600 mb-8">
        Ready to proceed? Fill in your details below and we'll send you a detailed quote along with next steps.
      </p>
      
      <div className="bg-[#F5F5F5] rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-[#20232A] mb-4">Your Configuration Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Size:</strong> {config.length}m × {config.depth}m ({priceData.areas.floorArea}m²)</p>
            <p><strong>Interior:</strong> {config.laminatedFloor ? "Laminated floor" : "Basic floor"}{config.skimmedFinish ? ", Skimmed finish" : ""}</p>
            <p><strong>Electrical:</strong> {config.ceilingLights} lights, {config.doubleSockets} sockets</p>
          </div>
          <div>
            <p><strong>Door:</strong> {config.doorType.replace(/_/g, " ").toUpperCase()}</p>
            <p><strong>Windows:</strong> {config.aluWindows + config.upvcWindows + config.roofWindows} total</p>
            <p><strong>Cladding:</strong> {config.frontCladding} front, {config.sideRearCladding} sides</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Price (inc VAT):</span>
            <span className="text-2xl font-bold text-[#D4AF37]">£{priceData.breakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message or Questions (Optional)
          </label>
          <textarea
            rows={4}
            value={customerInfo.message}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
            placeholder="Any specific requirements, questions, or additional information..."
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>We'll review your configuration and send a detailed quote</li>
                <li>Our team will contact you within 24 hours</li>
                <li>We can arrange a free site survey if needed</li>
                <li>No obligation - you're free to compare and decide</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Enquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}
