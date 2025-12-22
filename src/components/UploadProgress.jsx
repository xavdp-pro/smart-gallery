import { Loader2, CheckCircle2, XCircle, Upload, Sparkles, Save } from 'lucide-react'

export default function UploadProgress({ stage, progress, message }) {
  const stages = [
    { id: 'uploading', label: 'Upload', icon: Upload },
    { id: 'analyzing', label: 'Analyse', icon: Loader2 },
    { id: 'ai-processing', label: 'IA', icon: Sparkles },
    { id: 'saving-tags', label: 'Sauvegarde', icon: Save },
    { id: 'complete', label: 'Terminé', icon: CheckCircle2 },
  ]

  const getCurrentStageIndex = () => {
    const index = stages.findIndex(s => s.id === stage)
    return index === -1 ? 0 : index
  }

  const currentIndex = getCurrentStageIndex()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Traitement en cours
          </h3>
          <p className="text-sm text-slate-600">{message}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-600 mb-2">
            <span>Progression</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-3">
          {stages.map((stageItem, index) => {
            const Icon = stageItem.icon
            const isActive = index === currentIndex
            const isComplete = index < currentIndex
            const isPending = index > currentIndex

            return (
              <div
                key={stageItem.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/10 border-2 border-primary'
                    : isComplete
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-slate-50 border-2 border-slate-200'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-primary text-white'
                      : isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-300 text-slate-500'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-spin' : ''}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isActive
                        ? 'text-primary'
                        : isComplete
                        ? 'text-green-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {stageItem.label}
                  </p>
                </div>
                {isActive && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {isComplete && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
