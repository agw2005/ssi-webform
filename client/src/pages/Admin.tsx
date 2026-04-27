import { useRef, useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import ModifyView from "../components/non-reusable/admin/ModifyView.tsx";
import AddView from "../components/non-reusable/admin/AddView.tsx";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";
import Button from "../components/reusable/Button.tsx";
import Multiswitch, {
  type SwitchOption,
} from "../components/reusable/Multiswitch.tsx";
import RateView from "../components/non-reusable/admin/RateView.tsx";

const options: SwitchOption<string>[] = [
  { value: "Modify", label: "Modify PR" },
  { value: "Add", label: "Add Budget" },
  { value: "Rate", label: "Renew Rates" },
] as const;
type ViewMode = typeof options[number]["value"];

const Admin = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(options[0]["value"]);

  const generalModal = useRef<HTMLDialogElement>(null);
  const [generalModalContent, setGeneralModalContent] = useState<
    React.ReactNode
  >();

  const toggleGeneralModal = (
    option: "empty" | "success" | "error" | "confirm",
    errMessage?: Error | null,
    confirmMessage?: string | null,
    onConfirm?: () => void,
  ) => {
    const err = errMessage ?? null;
    const emptyContent = (
      <div className="flex flex-col gap-2 p-4 select-none">
        <h3 className="font-bold text-2xl">
          Please upload the budget according to the format!
        </h3>
      </div>
    );
    const successContent = (
      <div className="flex flex-col gap-2 p-4 select-none items-center">
        <h3 className="font-bold text-2xl">
          Succesfully added budget to the system.
        </h3>
        <p>Click anywhere to continue</p>
      </div>
    );
    const errorContent = (
      <div className="flex flex-col gap-2 p-4 select-none items-center">
        <h3 className="font-bold text-2xl">
          {err
            ? err.message
            : "Encountered a problem during submission. Aborted the request."}
        </h3>
        <p>Click anywhere to continue</p>
      </div>
    );
    const confirmContent = (
      <div className="flex flex-col gap-6 p-6 select-none items-center w-full max-w-sm mx-auto">
        <h3 className="font-bold text-xl text-center">
          {confirmMessage}
        </h3>
        <div className="flex justify-center w-full gap-4 mt-2">
          <div
            className="cursor-pointer flex-1"
            onClick={() => {
              if (onConfirm) onConfirm();
              toggleDialog(generalModal);
            }}
          >
            <Button label="Yes" id="confirmation-button-yes" variant="green" />
          </div>
          <div
            className="cursor-pointer flex-1"
            onClick={() => toggleDialog(generalModal)}
          >
            <Button label="No" id="confirmation-button-no" variant="red" />
          </div>
        </div>
      </div>
    );
    toggleDialog(generalModal);
    setGeneralModalContent(
      option === "empty"
        ? emptyContent
        : option === "success"
        ? successContent
        : option === "error"
        ? errorContent
        : confirmContent,
    );
  };

  return (
    <Primitive
      isLoading={[]}
      isErr={[]}
      componentName="Admin.tsx"
      pageTitle="Admin"
    >
      <Multiswitch
        id="admin-view-switch"
        variant="black"
        value={viewMode}
        setter={setViewMode}
        options={options}
      />
      {viewMode === options[0]["value"] && (
        <ModifyView
          toggleDialog={toggleGeneralModal}
        />
      )}
      {viewMode === options[1]["value"] && (
        <AddView toggleDialog={toggleGeneralModal} />
      )}
      {viewMode === options[2]["value"] && <RateView />}
      <Dialog
        toggle={() => toggleDialog(generalModal)}
        ref={generalModal}
      >
        {generalModalContent}
      </Dialog>
    </Primitive>
  );
};

export default Admin;
