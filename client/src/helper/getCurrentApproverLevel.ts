import type { TraceApproverPath } from "../../../server/models/TraceD.d.ts";

export const getCurrentApproverLevel = (data: TraceApproverPath[]): number => {
  const index = data.findIndex((item) => item.Result === "In Progress");
  const level = index + 1;
  return level;
};
