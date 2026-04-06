import { useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import Switch from "../components/reusable/Switch.tsx";
import ModifyView from "../components/non-reusable/admin/ModifyView.tsx";

const Admin = () => {
  const [viewMode, setViewMode] = useState<"Modify" | "Add">("Modify");

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
        <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max gap-2">
          Add
        </div>
      )}
    </Primitive>
  );
};

export default Admin;
