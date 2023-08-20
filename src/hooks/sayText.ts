import { useEffect, type Dispatch, type SetStateAction, useState } from 'react'
import { useTts } from 'tts-react'

interface SayTextProperties {
  text: string
  onEnd?: () => void
}
interface UseSayTextReturn {
  sayText: Dispatch<SetStateAction<SayTextProperties>>
}

export function useSayText(): UseSayTextReturn {
  const [props, setProps] = useState<SayTextProperties>({ text: '' })
  const { play } = useTts({
    children: props.text,
    markTextAsSpoken: true,
    onEnd: props.onEnd
  })

  useEffect(() => {
    play()
  }, [props.text, play])

  return { sayText: setProps }
}
