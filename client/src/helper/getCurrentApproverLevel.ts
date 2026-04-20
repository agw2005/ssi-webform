import type { ApproverPath } from "@scope/server";

export const getCurrentApproverLevel = (data: ApproverPath[]): number => {
  const index = data.findIndex((item) => item.Result === "In Progress");
  const level = index + 1;
  return level;
};
