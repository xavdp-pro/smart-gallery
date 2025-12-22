import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function EmailTestPanel() {
  const { token } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSendTest = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer une adresse email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Adresse email invalide');
      return;
    }

    setSending(true);
    setLastResult(null);

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, message })
      });

      const data = await response.json();

      if (response.ok) {
        setLastResult({
          success: true,
          messageId: data.messageId,
          timestamp: new Date()
        });
        toast.success('Email de test envoyé avec succès ! 📧');
        // Reset form
        setMessage('');
      } else {
        setLastResult({
          success: false,
          error: data.error || data.details || 'Erreur inconnue',
          timestamp: new Date()
        });
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setLastResult({
        success: false,
        error: error.message,
        timestamp: new Date()
      });
      toast.error('Erreur de connexion');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Test d'Envoi d'Email</h2>
            <p className="text-purple-100 text-sm mt-0.5">
              Vérifiez que votre configuration Mailjet fonctionne correctement
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSendTest} className="p-6 space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email destinataire <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            L'email de test sera envoyé à cette adresse
          </p>
        </div>

        {/* Message Optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message personnalisé (optionnel)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ajoutez un message personnalisé à l'email de test..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 focus:ring-4 focus:ring-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Envoyer l'Email de Test</span>
            </>
          )}
        </button>
      </form>

      {/* Result Display */}
      {lastResult && (
        <div className={`mx-6 mb-6 p-4 rounded-lg border-2 ${
          lastResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {lastResult.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`font-semibold ${
                lastResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {lastResult.success ? 'Email envoyé avec succès !' : 'Erreur lors de l\'envoi'}
              </h3>
              <div className={`mt-2 text-sm ${
                lastResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {lastResult.success ? (
                  <>
                    <p className="font-medium">Message ID: <code className="bg-white/50 px-2 py-0.5 rounded text-xs">{lastResult.messageId}</code></p>
                    <p className="mt-1">Envoyé à: <strong>{email}</strong></p>
                    <p className="mt-1 text-xs text-green-600">
                      Horodatage: {lastResult.timestamp.toLocaleString('fr-FR')}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Erreur: {lastResult.error}</p>
                    <p className="mt-1 text-xs text-red-600">
                      Horodatage: {lastResult.timestamp.toLocaleString('fr-FR')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mx-6 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">À propos du test d'email</h4>
            <ul className="text-sm text-blue-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Cet outil envoie un email de test via votre configuration Mailjet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Le template utilisé est le même que pour les emails de bienvenue et reset password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Vérifiez votre boîte de réception (et spam) après l'envoi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Le Message ID vous permet de tracer l'email dans les logs Mailjet</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats/Config Info */}
      <div className="mx-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-1">Service SMTP</div>
          <div className="text-lg font-bold text-gray-900">Mailjet</div>
          <div className="text-xs text-gray-600 mt-1">in-v3.mailjet.com:587</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-1">Expéditeur</div>
          <div className="text-lg font-bold text-gray-900">Photo Manager</div>
          <div className="text-xs text-gray-600 mt-1">monitoring@auvtel.net</div>
        </div>
      </div>
    </div>
  );
}
