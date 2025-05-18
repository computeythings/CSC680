import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

type ScreenFlashHandle = {
    flash: () => void  
}

const ScreenFlash = forwardRef<ScreenFlashHandle>((_, ref) => {
    const [flashing, setFlashing] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    // Expose flash method via ref
    useImperativeHandle(ref, () => ({
        flash: () => {
            setCoords({
                x: 20 + Math.floor(Math.random() * 14) * 5,
                y: 20 + Math.floor(Math.random() * 14) * 5,
            })
            setFlashing(false)
            requestAnimationFrame(() => setFlashing(true))
        },
    }))

    useEffect(() => {
        if (!flashing) return;
            const timeout = setTimeout(() => {
            setFlashing(false);
        }, 300);
        return () => clearTimeout(timeout)
    }, [flashing])

    if (!flashing) return null 

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'white',
          opacity: 1,
          animation: 'flashFade 0.3s forwards',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: `${coords.y}%`,
          left: `${coords.x}%`,
          backgroundColor: 'white',
          color: 'black',
          padding: '1rem 2rem',
          borderRadius: 4,
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          pointerEvents: 'none',
          zIndex: 10000,
          fontFamily: 'Courier New'
        }}
      >
        CLICK.
      </div>
    </>
  )
})

export default ScreenFlash
