type InputTypes = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const createGenericChangeHandler = <T>(
  stateSetter: React.Dispatch<React.SetStateAction<T>>,
) => {
  return (field: keyof T) => (e: InputTypes) => {
    stateSetter((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
};
