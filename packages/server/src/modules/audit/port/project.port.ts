export type AuditProjectLinkType = {
  id: string;
};

export type ProjectPort = {
  findManyByIds: (ids: string[]) => Promise<AuditProjectLinkType[]>;
};
