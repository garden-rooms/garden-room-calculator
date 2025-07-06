import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StepIndicator } from "./StepIndicator";
import { SizeStep } from "./steps/SizeStep";
import { InteriorStep } from "./steps/InteriorStep";
import { ElectricalStep } from "./steps/ElectricalStep";
import { DoorsStep } from "./steps/DoorsStep";
import { WindowsStep } from "./steps/WindowsStep";
import { CladdingStep } from "./steps/CladdingStep";
import { ContactStep } from "./steps/ContactStep";
import { PriceDisplay } from "./PriceDisplay";

export interface Configuration {
  length: number;
  depth: number;
  laminatedFloor: boolean;
  skimmedFinish: boolean;
  ceilingLights: number;
  doubleSockets: number;
  doorType: string;
  aluWindows: number;
  upvcWindows: number;
  roofWindows: number;
  frontCladding: string;
  sideRearCladding: string;
}

const initialConfig: Configuration = {
  length: 4,
  depth: 3,
  laminatedFloor: false,
  skimmedFinish: false,
  ceilingLights: 4,
  doubleSockets: 2,
  doorType: "upvc_french_180",
  aluWindows: 0,
  upvcWindows: 2,
  roofWindows: 0,
  frontCladding: "composite",
  sideRearCladding: "composite",
};

const steps = [
  { id: 1, title: "Size", component: SizeStep },
  { id: 2, title: "Interior", component: InteriorStep },
  { id: 3, title: "Electrical", component: ElectricalStep },
  { id: 4, title: "Doors", component: DoorsStep },
  { id: 5, title: "Windows", component: WindowsStep },
  { id: 6, title: "Cladding", component: CladdingStep },
  { id: 7, title: "Contact", component: ContactStep },
];

export function GardenRoomConfigurator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<Configuration>(initialConfig);
  
  const initializePricing = useMutation(api.pricing.initializePricing);
  
  useEffect(() => {
    initializePricing();
  }, [initializePricing]);

  const priceData = useQuery(api.quotes.calculatePrice, config);

  const updateConfig = (updates: Partial<Configuration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={goToStep}
      />
      
      <PriceDisplay priceData={priceData} />
      
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <CurrentStepComponent
          config={config}
          updateConfig={updateConfig}
          priceData={priceData}
          onNext={nextStep}
          onPrev={prevStep}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === steps.length}
        />
      </div>
    </div>
  );
}
