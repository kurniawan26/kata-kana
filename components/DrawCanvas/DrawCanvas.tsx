'use client'
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react'

export interface DrawCanvasHandle {
  clear: () => void
}

interface DrawCanvasProps {
  guideChar: string
  brushSize: number
}

const DrawCanvas = forwardRef<DrawCanvasHandle, DrawCanvasProps>(function DrawCanvas(
  { guideChar, brushSize },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  useImperativeHandle(ref, () => ({ clear: clearCanvas }), [clearCanvas])

  // Clear when character changes
  useEffect(() => {
    clearCanvas()
  }, [guideChar, clearCanvas])

  // Register draw events (re-runs when brushSize changes to pick up new value)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    const onMouseDown = (e: MouseEvent) => {
      isDrawing.current = true
      lastPos.current = getPos(e.clientX, e.clientY)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current || !lastPos.current) return
      const pos = getPos(e.clientX, e.clientY)
      stroke(lastPos.current, pos)
      lastPos.current = pos
    }
    const onStop = () => {
      isDrawing.current = false
      lastPos.current = null
    }
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      isDrawing.current = true
      lastPos.current = getPos(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!isDrawing.current || !lastPos.current) return
      const pos = getPos(e.touches[0].clientX, e.touches[0].clientY)
      stroke(lastPos.current, pos)
      lastPos.current = pos
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onStop)
    canvas.addEventListener('mouseleave', onStop)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onStop)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onStop)
      canvas.removeEventListener('mouseleave', onStop)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onStop)
    }
  }, [brushSize])

  return (
    <div className="relative w-full max-w-[360px] aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-white overflow-hidden">
      {/* Faint guide character */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
        style={{ fontSize: 'min(240px, 55vw)', lineHeight: 1, opacity: 0.07 }}
      >
        {guideChar}
      </div>
      {/* Drawing canvas — transparent so guide shows through */}
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-full h-full cursor-crosshair touch-none"
      />
    </div>
  )
})

export default DrawCanvas
