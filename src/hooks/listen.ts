import 'regenerator-runtime/runtime'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

export interface UseListenReturn {
  listen: { start: () => void; stop: () => void }
  listening: boolean
  browserSupport: boolean
  transcript: string
}

export function useListen(): UseListenReturn {
  const {
    listening,
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({})

  return {
    listen: {
      start: () => {
        void SpeechRecognition.startListening({ language: 'pt-BR' })
      },
      stop: () => {
        resetTranscript()
      }
    },
    listening,
    browserSupport: browserSupportsSpeechRecognition,
    transcript: transcript.toLowerCase()
  }
}
