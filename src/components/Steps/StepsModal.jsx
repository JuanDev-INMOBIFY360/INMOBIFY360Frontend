import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Steps from './Steps';
import './stepsModal.css';

export default function StepsModal({ 
  isOpen, 
  title, 
  steps = [], 
  children, 
  onClose, 
  onSubmit, 
  submitText = 'Guardar', 
  isLoading = false,
  currentStep = 0,
  setCurrentStep = () => {},
  validateStep = null
}) {
  if (!isOpen) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isValidStep = validateStep ? validateStep(currentStep) : true;

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (isValidStep && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-steps-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p className="modal-step-indicator">Paso {currentStep + 1} de {steps.length}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body modal-steps-body">
          <Steps 
            steps={steps} 
            currentStep={currentStep}
            onStepChange={handleStepClick}
          />

          <form onSubmit={onSubmit} className="steps-form">
            {children}

            <div className="modal-footer modal-steps-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                <ChevronLeft size={16} /> Anterior
              </button>

              {isLastStep ? (
                <button 
                  type="submit" 
                  className="btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : submitText}
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn"
                  onClick={handleNext}
                  disabled={!isValidStep}
                  title={!isValidStep ? 'Completa los campos requeridos' : ''}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
