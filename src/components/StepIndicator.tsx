interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepClick(step.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step.id === currentStep
                  ? "bg-[#D4AF37] text-white"
                  : step.id < currentStep
                  ? "bg-[#20232A] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.id}
            </button>
            <span className={`ml-2 text-sm font-medium ${
              step.id === currentStep ? "text-[#D4AF37]" : "text-gray-600"
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-4 ${
                step.id < currentStep ? "bg-[#20232A]" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
