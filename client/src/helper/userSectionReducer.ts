import type { UserSection } from "@scope/server-ssms";

interface ReducedValue {
  domain: string;
  subdomain: string[];
}

const userSectionReducer = (arr: UserSection[]) => {
  const reducedValues: ReducedValue[] = Object.values(
    arr.reduce(
      (acc, current) => {
        const { SectionName, NameUser } = current;
        if (!acc[SectionName]) {
          acc[SectionName] = {
            domain: SectionName,
            subdomain: [],
          };
        }
        acc[SectionName].subdomain.push(NameUser);

        return acc;
      },
      {} as Record<string, ReducedValue>,
    ),
  );
  return reducedValues;
};

export default userSectionReducer;
