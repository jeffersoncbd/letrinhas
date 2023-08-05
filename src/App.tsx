import React, { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'
import { useTts } from 'tts-react'

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
]

type LevelFunction = () => number

function useTextToSpeech(): {
  playText: React.Dispatch<React.SetStateAction<string>>
} {
  const [text, setText] = useState('')
  const { play } = useTts({
    children: text,
    markTextAsSpoken: true
  })

  useEffect(() => {
    play()
  }, [text, play])

  return { playText: setText }
}

const App: React.FC = () => {
  const {
    listening,
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()
  const { playText } = useTextToSpeech()

  const [color, setColor] = useState('black')
  const [alphabetIndex, setAlphabetIndex] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(0)

  const levelFunctions: LevelFunction[] = [
    () => {
      const index = alphabetIndex + 1
      setAlphabetIndex(index)
      return index
    },
    () => {
      const index = Math.floor(Math.random() * alphabet.length)
      return index
    }
  ]

  useEffect(() => {
    function updateAlphabetIndex(): void {
      setTimeout(() => {
        resetTranscript()
        setColor('black')
        const newIndex = levelFunctions[currentLevel]()
        setAlphabetIndex(newIndex)
        if (newIndex + 1 === alphabet.length) {
          setCurrentLevel(currentLevel + 1)
        }
        setTimeout(() => {
          void SpeechRecognition.startListening({ language: 'pt-BR' })
        }, 100)
      }, 1000)
    }

    if (transcript.length !== 0 && !listening) {
      let newColor = 'red'
      if (
        transcript.toLowerCase().includes(`letra ${alphabet[alphabetIndex]}`)
      ) {
        newColor = 'green'
      } else {
        playText(`letra ${alphabet[alphabetIndex]}`)
      }
      setColor(newColor)
      updateAlphabetIndex()
    }
  }, [transcript, listening])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&#39;t support speech recognition.</span>
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5
      }}
    >
      <span style={{ color: 'gray', alignSelf: 'flex-end' }}>
        level {currentLevel + 1}
      </span>
      <span style={{ color, fontSize: 100, cursor: 'default' }}>
        {alphabet[alphabetIndex].toUpperCase()}
      </span>
      <div style={{ fontSize: 50, marginBottom: -60, cursor: 'default' }}>
        🎙️
      </div>
      <div
        style={{
          height: 50,
          width: 50,
          cursor: 'pointer',
          backgroundColor: listening ? '#ffffff00' : '#ffffffcc'
        }}
        onClick={() => {
          if (!listening) {
            void SpeechRecognition.startListening({ language: 'pt-BR' })
          } else {
            resetTranscript()
          }
        }}
      ></div>
    </div>
  )
}

export default App
