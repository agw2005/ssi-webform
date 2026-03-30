import { forwardRef } from "react";

export const toggleDialog = (
  dialogRef: React.RefObject<HTMLDialogElement | null>,
) => {
  if (!dialogRef.current) {
    return;
  }
  dialogRef.current.hasAttribute("open")
    ? dialogRef.current.close()
    : dialogRef.current.showModal();
};

interface DialogProps {
  children: React.ReactNode;
  toggle: () => void;
  position?: string;
}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, toggle, position = "" }, dialogReference) => {
    return (
      <dialog
        ref={dialogReference}
        onClick={(e) => {
          if (e.target === e.currentTarget) toggle();
        }}
        className={`backdrop:bg-black/75 | transition | self-center justify-self-center rounded-xl ${position}`}
      >
        {children}
      </dialog>
    );
  },
);

export default Dialog;
