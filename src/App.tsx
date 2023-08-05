import React, { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'
import { alphabet } from './alphabet'
import { useSayText } from './hooks/sayText'

type LevelFunction = () => number

const App: React.FC = () => {
  const {
    listening,
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({})
  const sayText = useSayText()

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

  function updateAlphabetIndex(): void {
    resetTranscript()
    setColor('black')
    const newIndex = levelFunctions[currentLevel]()
    setAlphabetIndex(newIndex)
    if (newIndex + 1 === alphabet.length) {
      setCurrentLevel(currentLevel + 1)
    }
    void SpeechRecognition.startListening({ language: 'pt-BR' })
  }

  useEffect(() => {
    if (transcript.length !== 0 && !listening) {
      if (
        `${transcript} `
          .toLowerCase()
          .includes(`letra ${alphabet[alphabetIndex][0]} `)
      ) {
        updateAlphabetIndex()
      } else {
        setColor('red')
        sayText({
          text: `letra ${alphabet[alphabetIndex][0]} de ${alphabet[alphabetIndex][2]}`,
          onEnd: updateAlphabetIndex
        })
      }
    }
  }, [transcript, listening])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&#39;t support speech recognition.</span>
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto'
        }}
      >
        <div style={{ alignSelf: 'center' }}>
          <span style={{ fontSize: 70 }}>{alphabet[alphabetIndex][1]}</span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span style={{ color, fontSize: 100, cursor: 'default' }}>
            {alphabet[alphabetIndex][0].toUpperCase()}
          </span>
          <div style={{ fontSize: 50, marginBottom: -60, cursor: 'default' }}>
            🎙️
          </div>
          <div
            style={{
              height: 60,
              width: 50,
              cursor: 'pointer',
              backgroundColor: listening ? '#ffffff00' : '#ffffffcc'
            }}
            onClick={() => {
              if (!listening) {
                void SpeechRecognition.startListening({
                  language: 'pt-BR'
                })
              } else {
                resetTranscript()
              }
            }}
          ></div>
          <span style={{ color: 'white' }}>!</span>{' '}
          <div style={{ marginTop: 4, color: 'gray' }}>
            {transcript}
            <span style={{ color: 'white' }}>!</span>
          </div>
        </div>

        <span style={{ color: 'gray', alignSelf: 'flex-start' }}>
          level {currentLevel + 1}
        </span>
      </div>
    </div>
  )
}

export default App
