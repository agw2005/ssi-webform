import type { SupervisorNRPs } from "@scope/server";

const rawSupervisors: string = import.meta.env.VITE_SUPERVISORS_NRP;

export const defaultSupervisorsNRP: SupervisorNRPs = rawSupervisors
  ? (JSON.parse(rawSupervisors) as SupervisorNRPs)
  : {
    approver: [],
    releaser: [],
    administrator: [],
  };
