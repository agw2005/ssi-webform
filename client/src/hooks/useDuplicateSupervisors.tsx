import { useMemo } from "react";
import type { SupervisorNames } from "@scope/server";
import capitalize from "../helper/capitalize.ts";

export const useDuplicateSupervisors = (
  supervisorNames: SupervisorNames[] | null,
) =>
  useMemo(() => {
    if (!supervisorNames) return [];

    const nameFrequency = new Map<string, number>();
    for (const supervisor of supervisorNames) {
      const capitalizedName = capitalize(supervisor.NameUser);
      nameFrequency.set(
        capitalizedName,
        (nameFrequency.get(capitalizedName) || 0) + 1,
      );
    }

    return supervisorNames.map((supervisor) => {
      const capitalizedName = capitalize(supervisor.NameUser);
      const isDuplicate = (nameFrequency.get(capitalizedName) || 0) > 1;

      return {
        IDUser: supervisor.IDUser,
        NameUser: capitalizedName,
        displayedName: isDuplicate
          ? `${capitalizedName} (${supervisor.IDUser})`
          : capitalizedName,
      };
    });
  }, [supervisorNames]);
