import { useState } from "react";

export function usePropertySteps(totalSteps = 5) {
  const [currentStep, setCurrentStep] = useState(1);

  const next = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 1));

  return { currentStep, next, prev };
}
