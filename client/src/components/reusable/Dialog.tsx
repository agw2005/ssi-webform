import { forwardRef } from "react";

interface RejectDialogProps {
  children: React.ReactNode;
  toggleDialog: () => void;
}

const Dialog = forwardRef<HTMLDialogElement, RejectDialogProps>(
  ({ children, toggleDialog }, rejectReference) => {
    return (
      <dialog
        ref={rejectReference}
        onClick={(e) => {
          if (e.target === e.currentTarget) toggleDialog();
        }}
        className="self-center justify-self-center rounded-xl"
      >
        {children}
      </dialog>
    );
  },
);

export default Dialog;
