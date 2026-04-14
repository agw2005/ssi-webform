import type { FileResource } from "@scope/server-ssms";

const fileResourceFetchHandler = (arr: FileResource[] | null) => {
  return !arr
    ? []
    : arr.map((budget) => budget.FileResource.replace("amp;", ""));
};

export default fileResourceFetchHandler;
