import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Circle, FileText, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const TaxFiling: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      ssn: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    income: {
      wages: '',
      interest: '',
      dividends: '',
      business: '',
      other: ''
    },
    deductions: {
      standardDeduction: true,
      itemizedDeductions: {
        mortgageInterest: '',
        propertyTax: '',
        charitable: '',
        medical: ''
      }
    }
  });

  const steps = [
    { id: 'personal', title: 'Personal Information', description: 'Basic personal details' },
    { id: 'income', title: 'Income Information', description: 'Wages, interest, and other income' },
    { id: 'deductions', title: 'Deductions', description: 'Standard or itemized deductions' },
    { id: 'review', title: 'Review & Submit', description: 'Review your information' }
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (currentStep === steps.length - 1) {
      // Submit the tax return
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        toast.success('Tax return submitted successfully!');
        setCurrentStep(0);
        // Reset form data
        setFormData({
          personalInfo: {
            firstName: '',
            lastName: '',
            ssn: '',
            dateOfBirth: '',
            address: '',
            city: '',
            state: '',
            zipCode: ''
          },
          income: {
            wages: '',
            interest: '',
            dividends: '',
            business: '',
            other: ''
          },
          deductions: {
            standardDeduction: true,
            itemizedDeductions: {
              mortgageInterest: '',
              propertyTax: '',
              charitable: '',
              medical: ''
            }
          }
        });
      } catch (error) {
        toast.error('Failed to submit tax return');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData.personalInfo} onChange={handleInputChange} />;
      case 1:
        return <IncomeStep formData={formData.income} onChange={handleInputChange} />;
      case 2:
        return <DeductionsStep formData={formData.deductions} onChange={handleInputChange} />;
      case 3:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Tax Filing</h2>
        <p className="text-secondary-600">Complete your tax return step by step.</p>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-primary-600' : 'text-secondary-600'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-secondary-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-5 w-5 text-secondary-400 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : currentStep === steps.length - 1 ? 'Submit Return' : 'Next'}
        </button>
      </div>
    </div>
  );
};

const PersonalInfoStep: React.FC<{ formData: any; onChange: (section: string, field: string, value: string) => void }> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">First Name</label>
          <input
            type="text"
            className="input-field"
            value={formData.firstName}
            onChange={(e) => onChange('personalInfo', 'firstName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Last Name</label>
          <input
            type="text"
            className="input-field"
            value={formData.lastName}
            onChange={(e) => onChange('personalInfo', 'lastName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">SSN</label>
          <input
            type="text"
            className="input-field"
            placeholder="XXX-XX-XXXX"
            value={formData.ssn}
            onChange={(e) => onChange('personalInfo', 'ssn', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Date of Birth</label>
          <input
            type="date"
            className="input-field"
            value={formData.dateOfBirth}
            onChange={(e) => onChange('personalInfo', 'dateOfBirth', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-1">Address</label>
          <input
            type="text"
            className="input-field"
            value={formData.address}
            onChange={(e) => onChange('personalInfo', 'address', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">City</label>
          <input
            type="text"
            className="input-field"
            value={formData.city}
            onChange={(e) => onChange('personalInfo', 'city', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">State</label>
          <select
            className="input-field"
            value={formData.state}
            onChange={(e) => onChange('personalInfo', 'state', e.target.value)}
          >
            <option value="">Select State</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">ZIP Code</label>
          <input
            type="text"
            className="input-field"
            value={formData.zipCode}
            onChange={(e) => onChange('personalInfo', 'zipCode', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const IncomeStep: React.FC<{ formData: any; onChange: (section: string, field: string, value: string) => void }> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Income Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Wages, Salaries, Tips</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="number"
              className="input-field pl-10"
              placeholder="0.00"
              value={formData.wages}
              onChange={(e) => onChange('income', 'wages', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Interest Income</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="number"
              className="input-field pl-10"
              placeholder="0.00"
              value={formData.interest}
              onChange={(e) => onChange('income', 'interest', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Dividends</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="number"
              className="input-field pl-10"
              placeholder="0.00"
              value={formData.dividends}
              onChange={(e) => onChange('income', 'dividends', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Business Income</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="number"
              className="input-field pl-10"
              placeholder="0.00"
              value={formData.business}
              onChange={(e) => onChange('income', 'business', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Other Income</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="number"
              className="input-field pl-10"
              placeholder="0.00"
              value={formData.other}
              onChange={(e) => onChange('income', 'other', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DeductionsStep: React.FC<{ formData: any; onChange: (section: string, field: string, value: string) => void }> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Deductions</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="standard"
            name="deductionType"
            checked={formData.standardDeduction}
            onChange={() => onChange('deductions', 'standardDeduction', 'true')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
          />
          <label htmlFor="standard" className="ml-2 text-sm font-medium text-secondary-700">
            Standard Deduction ($13,850 for 2023)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="radio"
            id="itemized"
            name="deductionType"
            checked={!formData.standardDeduction}
            onChange={() => onChange('deductions', 'standardDeduction', 'false')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
          />
          <label htmlFor="itemized" className="ml-2 text-sm font-medium text-secondary-700">
            Itemized Deductions
          </label>
        </div>
      </div>

      {!formData.standardDeduction && (
        <div className="space-y-4 pl-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Mortgage Interest</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="number"
                className="input-field pl-10"
                placeholder="0.00"
                value={formData.itemizedDeductions.mortgageInterest}
                onChange={(e) => onChange('deductions', 'mortgageInterest', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Property Taxes</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="number"
                className="input-field pl-10"
                placeholder="0.00"
                value={formData.itemizedDeductions.propertyTax}
                onChange={(e) => onChange('deductions', 'propertyTax', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Charitable Contributions</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="number"
                className="input-field pl-10"
                placeholder="0.00"
                value={formData.itemizedDeductions.charitable}
                onChange={(e) => onChange('deductions', 'charitable', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Medical Expenses</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="number"
                className="input-field pl-10"
                placeholder="0.00"
                value={formData.itemizedDeductions.medical}
                onChange={(e) => onChange('deductions', 'medical', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewStep: React.FC<{ formData: any }> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Review Your Information</h3>
      
      <div className="space-y-4">
        <div className="card">
          <h4 className="font-medium text-secondary-900 mb-2">Personal Information</h4>
          <div className="text-sm text-secondary-600">
            <p>{formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
            <p>{formData.personalInfo.address}</p>
            <p>{formData.personalInfo.city}, {formData.personalInfo.state} {formData.personalInfo.zipCode}</p>
          </div>
        </div>

        <div className="card">
          <h4 className="font-medium text-secondary-900 mb-2">Income Summary</h4>
          <div className="text-sm text-secondary-600 space-y-1">
            <p>Wages: ${formData.income.wages || '0'}</p>
            <p>Interest: ${formData.income.interest || '0'}</p>
            <p>Dividends: ${formData.income.dividends || '0'}</p>
            <p>Business: ${formData.income.business || '0'}</p>
            <p>Other: ${formData.income.other || '0'}</p>
          </div>
        </div>

        <div className="card">
          <h4 className="font-medium text-secondary-900 mb-2">Deductions</h4>
          <div className="text-sm text-secondary-600">
            {formData.deductions.standardDeduction ? (
              <p>Standard Deduction: $13,850</p>
            ) : (
              <div>
                <p>Itemized Deductions:</p>
                <p>• Mortgage Interest: ${formData.deductions.itemizedDeductions.mortgageInterest || '0'}</p>
                <p>• Property Tax: ${formData.deductions.itemizedDeductions.propertyTax || '0'}</p>
                <p>• Charitable: ${formData.deductions.itemizedDeductions.charitable || '0'}</p>
                <p>• Medical: ${formData.deductions.itemizedDeductions.medical || '0'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxFiling;
