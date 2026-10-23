export type User = { id: string; name: string };

const COLORS: Record<string, string> = { ada: "#7c3aed", grace: "#0891b2" };

export const colorOf = (id: string) => COLORS[id] ?? "#737373";
