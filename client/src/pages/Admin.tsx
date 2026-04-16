import { useRef, useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import ModifyView from "../components/non-reusable/admin/ModifyView.tsx";
import AddView from "../components/non-reusable/admin/AddView.tsx";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";
import Button from "../components/reusable/Button.tsx";
import Multiswitch, {
  SwitchOption,
} from "../components/reusable/Multiswitch.tsx";

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
    option: "empty" | "success" | "error" | "modify",
    errMessage?: Error | null,
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
    const modifyContent = (
      <form className="flex flex-col w-2xl gap-4 p-4 select-none">
        <label htmlFor="input-text" className="flex items-center gap-2">
          <p className="font-bold">Text</p>
          <input
            type="text"
            name="input-text"
            id="input-text"
            className="border px-2 py-1 w-full rounded-xl"
          />
        </label>
        <Button label="Modify" id="modify-button" variant="black" />
      </form>
    );
    toggleDialog(generalModal);
    setGeneralModalContent(
      option === "empty"
        ? emptyContent
        : option === "success"
        ? successContent
        : option === "error"
        ? errorContent
        : modifyContent,
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
      {viewMode === options[2]["value"] && <p>Change Rate Dollar Here</p>}
      <Dialog
        toggle={() => toggleDialog(generalModal)}
        ref={generalModal}
        position="-top-144"
      >
        {generalModalContent}
      </Dialog>
    </Primitive>
  );
};

export default Admin;
