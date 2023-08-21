import { useEffect, useState } from 'react'
import { useTts } from 'tts-react'

interface SayTextProperties {
  text: string
  onEnd?: () => void
}
interface InternalProperties extends SayTextProperties {
  date: Date
}
interface UseSayTextReturn {
  sayText: (properties: SayTextProperties) => void
}

export function useSayText(): UseSayTextReturn {
  const [props, setProps] = useState<InternalProperties>({
    text: '',
    date: new Date()
  })

  const { play } = useTts({
    children: props.text,
    markTextAsSpoken: true,
    onEnd: props.onEnd
  })

  useEffect(() => {
    play()
  }, [props, play])

  return {
    sayText: (newProps) => {
      setProps({ ...newProps, date: new Date() })
    }
  }
}
