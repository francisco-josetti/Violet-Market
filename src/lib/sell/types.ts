import { SellFormData } from './schemas';

export type { SellFormData };

export interface SellWizardContextType {
  currentStep: 1 | 2 | 3 | 4;
  formData: Partial<SellFormData>;
  goTo: (step: 1 | 2 | 3 | 4) => void;
  updateData: (partial: Partial<SellFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetWizard: () => void;
}

export interface StepProps {
  defaultValues: Partial<SellFormData>;
  onStepComplete: (data: Partial<SellFormData>) => void;
  onBack?: () => void;
}
