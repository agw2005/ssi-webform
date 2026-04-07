import { useRef, useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import Switch from "../components/reusable/Switch.tsx";
import ModifyView from "../components/non-reusable/admin/ModifyView.tsx";
import AddView from "../components/non-reusable/admin/AddView.tsx";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";

const Admin = () => {
  const [viewMode, setViewMode] = useState<"Modify" | "Add">("Modify");
  const generalModal = useRef<HTMLDialogElement>(null);

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
      {viewMode === "Modify" && <ModifyView />}
      {viewMode === "Add" && (
        <AddView toggleDialog={() => toggleDialog(generalModal)} />
      )}
      <Dialog
        toggle={() => toggleDialog(generalModal)}
        ref={generalModal}
        position="-top-144"
      >
        <div className="flex flex-col gap-2 p-4 select-none">
          <h3 className="font-bold text-2xl">
            Please upload the budget according to the format
          </h3>
        </div>
      </Dialog>
    </Primitive>
  );
};

export default Admin;
