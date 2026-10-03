"use client"

import { useCallback, useEffect, useRef } from "react"

type TProps = {
  labelledBy: string
  onClose: () => void
  className?: string
  children: (close: () => void) => React.ReactNode
}

export function BaseDialog({ labelledBy, onClose, className, children }: TProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = useCallback(() => dialogRef.current?.close(), [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // The backdrop is part of the <dialog> box, so a click that targets the dialog itself landed outside its content.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      className={className}
    >
      {children(close)}
    </dialog>
  )
}
