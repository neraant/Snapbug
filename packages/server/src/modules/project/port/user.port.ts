export type ProjectUserPort = {
  findById: (userId: string) => Promise<{ id: string } | null>;
};
