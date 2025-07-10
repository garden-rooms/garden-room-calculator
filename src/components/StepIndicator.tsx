import React from "react";

interface StepIndicatorProps {
  steps: { id: number; title: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav
      className="w-full mb-8 overflow-x-auto"
      aria-label="Progress"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <ol
        className="flex flex-nowrap md:flex-wrap gap-2 md:gap-4 px-1 md:px-0"
        style={{ minWidth: 0 }}
      >
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <li
              key={step.id}
              className="flex-shrink-0 min-w-[120px] md:min-w-0"
              style={{ maxWidth: 180 }}
            >
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`w-full flex flex-col items-center px-2 py-2 rounded-lg transition-colors
                  ${isActive
                    ? "bg-[#D4AF37] text-white font-bold shadow"
                    : isCompleted
                    ? "bg-[#20232A] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                  `}
                style={{
                  minWidth: 100,
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full mb-1
                    ${isActive
                      ? "bg-white text-[#D4AF37] border-2 border-[#D4AF37]"
                      : isCompleted
                      ? "bg-[#D4AF37] text-white"
                      : "bg-white text-gray-400 border-2 border-gray-300"}
                  `}
                  style={{ fontWeight: 700 }}
                >
                  {step.id}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <style>
        {`
          @media (max-width: 640px) {
            .step-indicator-scroll::-webkit-scrollbar {
              display: none;
            }
          }
        `}
      </style>
    </nav>
  );
}
