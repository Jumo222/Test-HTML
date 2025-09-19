import { useState, useCallback } from 'react'

const useInteractivity = () => {
  const [backgroundColor, setBackgroundColor] = useState('#f4f4f4')
  const [counter, setCounter] = useState(0)

  const colors = ['#f4f4f4', '#e8f5e8', '#fff2e8', '#f0e8ff', '#e8f4fd']

  const changeBackgroundColor = useCallback(() => {
    const currentIndex = colors.indexOf(backgroundColor)
    const nextIndex = (currentIndex + 1) % colors.length
    setBackgroundColor(colors[nextIndex])
  }, [backgroundColor, colors])

  const incrementCounter = useCallback(() => {
    setCounter(prev => prev + 1)
  }, [])

  return {
    backgroundColor,
    counter,
    changeBackgroundColor,
    incrementCounter
  }
}

export default useInteractivity