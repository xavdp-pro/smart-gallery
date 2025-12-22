import { X } from 'lucide-react';

export default function MobileWarningModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Application non optimisée pour mobile</h2>
          <p className="text-gray-600 mb-6">
            Pour une meilleure expérience, nous vous recommandons d'utiliser cette application sur un ordinateur de bureau.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Je comprends, continuer quand même
          </button>
        </div>
      </div>
    </div>
  );
}
