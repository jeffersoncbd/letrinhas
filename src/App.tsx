import React, { useEffect, useState } from 'react'

import { alphabet } from './alphabet'
import { useSayText } from './hooks/sayText'
import { useListen } from './hooks/listen'

type LevelFunction = () => number

const App: React.FC = () => {
  const { sayText } = useSayText()
  const { listen, browserSupport, listening, transcript } = useListen()

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
    listen.stop()
    setColor('black')
    const newIndex = levelFunctions[currentLevel]()
    setAlphabetIndex(newIndex)
    if (newIndex + 1 === alphabet.length) {
      setCurrentLevel(currentLevel + 1)
    }
    listen.start()
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
        listen.stop()
        setColor('red')
        sayText({
          text: `letra ${alphabet[alphabetIndex][0]} de ${alphabet[alphabetIndex][2]}`,
          onEnd: () => {
            setColor('black')
            listen.start()
          }
        })
      }
    }
  }, [transcript, listening])

  if (!browserSupport) {
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
          margin: '0 auto',
          flexDirection: 'column'
        }}
      >
        <span style={{ color: 'gray', alignSelf: 'flex-end' }}>
          level {currentLevel + 1}
        </span>

        <div style={{ alignSelf: 'center' }}>
          <span style={{ fontSize: 200 }}>{alphabet[alphabetIndex][1]}</span>
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
                listen.start()
              } else {
                listen.stop()
              }
            }}
          ></div>
          <span style={{ color: 'white' }}>!</span>{' '}
          <div style={{ marginTop: 4, color: 'gray' }}>
            {transcript}
            <span style={{ color: 'white' }}>!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
