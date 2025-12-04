import React from 'react';
import { Check } from 'lucide-react';
import './steps.css';

export default function Steps({ steps = [], currentStep = 0, onStepChange = () => {} }) {
  return (
    <div className="steps-container">
      <div className="steps-header">
        {steps.map((step, index) => (
          <div key={index} className="steps-item">
            <div 
              className={`steps-circle ${
                index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
              }`}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                <span className="steps-number">{index + 1}</span>
              )}
            </div>
            <div className="steps-label">{step}</div>
            {index < steps.length - 1 && (
              <div className={`steps-connector ${index < currentStep ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="steps-progress">
        <div 
          className="steps-progress-bar" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
