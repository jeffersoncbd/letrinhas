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
  const [hearts, setHearts] = useState(5)
  const [score, setScore] = useState(0)

  const levelFunctions: LevelFunction[] = [
    () => {
      const index = alphabetIndex + 1
      setAlphabetIndex(index)
      return index
    },
    () => {
      const index = Math.floor(Math.random() * alphabet.length)
      return index
    },
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

  function levelUpdateConditions(): boolean {
    return (
      (score === 25 && currentLevel === 0) ||
      (score === 15 && currentLevel === 1)
    )
  }

  function updateAlphabetIndex(): void {
    listen.stop()
    setColor('black')
    const newIndex = levelFunctions[currentLevel]()
    setAlphabetIndex(newIndex)
    if (levelUpdateConditions()) {
      setCurrentLevel(currentLevel + 1)
      setScore(0)
    }
    listen.start()
  }

  useEffect(() => {
    if (hearts === 0) {
      setAlphabetIndex(0)
      setCurrentLevel(0)
      setHearts(5)
      setScore(0)
      listen.stop()
      sayText({
        text: 'Acabaram as chances, vamos recomeçar!'
      })
    }
  }, [hearts])

  useEffect(() => {
    if (transcript.length !== 0 && !listening) {
      if (
        `${transcript} `
          .toLowerCase()
          .includes(`letra ${alphabet[alphabetIndex][0]} `)
      ) {
        setScore(score + 1)
        updateAlphabetIndex()
      } else {
        listen.stop()
        setColor('red')
        sayText({
          text: `letra ${alphabet[alphabetIndex][0]} de ${alphabet[alphabetIndex][2]}`,
          onEnd: () => {
            setHearts(hearts - 1)
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{Array.from({ length: hearts }, () => '❤️')}</span>
          <span style={{ color: 'gray' }}>
            {score} - level {currentLevel + 1}
          </span>
        </div>

        <div style={{ alignSelf: 'center' }}>
          {currentLevel <= 2 && (
            <span style={{ fontSize: 200 }}>{alphabet[alphabetIndex][1]}</span>
          )}
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
