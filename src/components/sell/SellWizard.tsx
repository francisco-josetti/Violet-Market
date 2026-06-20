// 1. Imports externos
import React, { useState, useEffect } from 'react';

// 2. Imports internos
import StepIndicator from './ui/StepIndicator';
import Step1Info from './steps/Step1Info';
import Step2Media from './steps/Step2Media';
import Step3Details from './steps/Step3Details';
import Step4Review from './steps/Step4Review';
import { loadDraft, saveDraft, clearDraft } from '../../lib/sell/draft';
import { SellFormData } from '../../lib/sell/schemas';

// 3. Tipos/interfaces locais
type StepNumber = 1 | 2 | 3 | 4;

// 4. Constantes locais

// 5. Componente
function SellWizard() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [formData, setFormData] = useState<Partial<SellFormData>>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Carregar rascunho no client-side para evitar descompasso de hidratação
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft).length > 0) {
      setHasDraft(true);
    }
    setHydrated(true);
  }, []);

  const handleStepComplete = (stepData: Partial<SellFormData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (currentStep < 4) {
      const next = (currentStep + 1) as StepNumber;
      setCurrentStep(next);
      saveDraft(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepNumber);
    }
  };

  const handleResumeDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft);
      // Se houver imagens, provavelmente já passou da etapa 1. Vamos estimar a etapa
      if (draft.description) setCurrentStep(4);
      else if (draft.images && draft.images.length > 0) setCurrentStep(3);
      else setCurrentStep(2);
    }
    setHasDraft(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setFormData({});
    setCurrentStep(1);
    setHasDraft(false);
  };

  if (!hydrated) return null;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 md:gap-8 font-sans">
      {/* Banner de Rascunho */}
      {hasDraft && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h3 className="font-hanken text-base font-bold text-primary">Anúncio em andamento</h3>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Você possui um rascunho salvo anteriormente. Deseja continuar de onde parou?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-4 py-2 border border-border hover:border-destructive/30 hover:bg-destructive/10 text-foreground hover:text-destructive rounded-xl font-mono text-xs transition-all cursor-pointer"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleResumeDraft}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Continuar Anúncio
            </button>
          </div>
        </div>
      )}

      {/* Indicador de Passos */}
      <div className="bg-card border border-border rounded-2xl p-5 md:px-6 md:py-5">
        <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      {/* Conteúdo da Etapa */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        {currentStep === 1 && (
          <Step1Info defaultValues={formData} onStepComplete={handleStepComplete} />
        )}
        {currentStep === 2 && (
          <Step2Media defaultValues={formData} onStepComplete={handleStepComplete} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <Step3Details defaultValues={formData} onStepComplete={handleStepComplete} onBack={handleBack} />
        )}
        {currentStep === 4 && (
          <Step4Review formData={formData} goToStep={setCurrentStep} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

// 6. Export default
export default SellWizard;