export interface BudgetTable {
  CostCenter: string;
  Nature: string;
  Periode: string;
  Budget: number;
  Balance: number;
  IDSection: number;
  FileResource: string;
}

export interface BudgetFileResource {
  FileResource: string;
}

export interface BudgetNature {
  Nature: string;
}

export interface BudgetBalance {
  Balance: string;
}

export interface BudgetViewInformation {
  DatabasePeriod: string;
  MonthIndex: number;
  PeriodYear: number;
  FileResource: string;
  Department: number;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: number;
  Balance: number;
}

export interface ReportViewInformation {
  Periode: string;
  FileResource: string;
  ResourceName: string;
  Department: number;
  DepartmentGroup: string;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: number;
  Balance: number;
}

export interface BudgetYear {
  Year: string;
}

export interface BudgetPeriod {
  Period: string;
}

export interface ValidDepartment {
  Identifier: string;
  Description: string;
  Dept: string;
}

export interface ValidCostCenter {
  Identifier: string;
  Description: string;
}
