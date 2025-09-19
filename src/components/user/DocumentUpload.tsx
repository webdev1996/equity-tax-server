import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'completed' | 'error';
  file?: File;
}

const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = [
    { id: 'w2', name: 'W-2 Form', description: 'Wage and Tax Statement' },
    { id: '1099', name: '1099 Forms', description: 'Various 1099 income forms' },
    { id: 'receipts', name: 'Receipts', description: 'Business expense receipts' },
    { id: 'bank', name: 'Bank Statements', description: 'Interest and dividend statements' },
    { id: 'other', name: 'Other Documents', description: 'Additional tax documents' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'uploading',
        file
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate upload
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, status: 'completed' as const }
              : doc
          )
        );
      }, 2000);
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document removed successfully');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Document Upload</h2>
        <p className="text-secondary-600">Upload your tax documents securely.</p>
      </div>

      {/* Document Types */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Common Document Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.map(type => (
            <div key={type.id} className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
              <FileText className="h-8 w-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-secondary-900">{type.name}</h4>
              <p className="text-sm text-secondary-600">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Upload Documents</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-secondary-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-secondary-900 mb-2">
            Drag and drop your files here
          </p>
          <p className="text-secondary-600 mb-4">
            or click to browse files
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="btn-primary cursor-pointer inline-block"
          >
            Choose Files
          </label>
          <p className="text-xs text-secondary-500 mt-2">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
          </p>
        </div>
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium text-secondary-900">{doc.name}</p>
                    <p className="text-sm text-secondary-600">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="p-1 text-secondary-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-1 bg-blue-100 rounded-full">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Secure Document Storage</h4>
            <p className="text-sm text-blue-700 mt-1">
              All documents are encrypted and stored securely. Your information is protected with bank-level security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
