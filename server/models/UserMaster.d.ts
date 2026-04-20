export interface UserMasterTable {
  IDUser: number;
  UserName: string;
  Password: string;
  NameUser: string;
  NRP: string;
  IDSection: number;
  IDTitle: number;
  Email: string;
  LastLogin: string;
}

export interface UserMasterName {
  NameUser: string;
  IDUser: number;
}

export interface UserIdByName {
  IDUser: number;
}

export interface AuthInfo {
  IDUser: number;
  UserName: string;
  Password: string;
  NameUser: string;
  NRP: string;
}
