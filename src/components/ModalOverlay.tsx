import { useLayoutEffect, useRef, type ReactNode } from 'react';

interface ModalOverlayProps {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}

export function ModalOverlay({ titleId, onClose, children }: ModalOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-slate-950/80 p-4 text-inherit backdrop-blur-sm backdrop:bg-transparent open:flex"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      {children}
    </dialog>
  );
}
