import { useRef, useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import Switch from "../components/reusable/Switch.tsx";
import ModifyView from "../components/non-reusable/admin/ModifyView.tsx";
import AddView from "../components/non-reusable/admin/AddView.tsx";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";

const Admin = () => {
  const [viewMode, setViewMode] = useState<"Modify" | "Add">("Modify");
  const generalModal = useRef<HTMLDialogElement>(null);
  const [generalModalContent, setGeneralModalContent] = useState<
    React.ReactNode
  >();

  const toggleGeneralModal = (
    option: "empty" | "success" | "error",
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
    toggleDialog(generalModal);
    setGeneralModalContent(
      option === "empty"
        ? emptyContent
        : option === "success"
        ? successContent
        : errorContent,
    );
  };

  return (
    <Primitive
      isLoading={[]}
      isErr={[]}
      componentName="Admin.tsx"
      pageTitle="Admin"
    >
      <Switch
        id="admin-view-switch"
        variant="black"
        onValue="Modify"
        offValue="Add"
        onLabel="Modify PR"
        offLabel="Add Budget"
        setter={setViewMode}
        getter={viewMode}
      />
      {viewMode === "Modify" && (
        <ModifyView
          toggleDialog={toggleGeneralModal}
        />
      )}
      {viewMode === "Add" && <AddView toggleDialog={toggleGeneralModal} />}
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
