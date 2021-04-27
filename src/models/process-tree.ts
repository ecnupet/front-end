import { RoomProcess } from "../api/info-manage";

export interface ProcessItem extends RoomProcess {
  children: ProcessItem[];
}

export function makeProcessTree(originalItems: RoomProcess[]): ProcessItem {
  const root: ProcessItem = {
    id: -1,
    children: [],
    fatherId: -1,
    image: "",
    name: "---",
    process: "",
    video: "",
  };
  const itemMapping = new Map<number, ProcessItem>(
    originalItems.map((item) => [item.id, { ...item, children: [] }])
  );
  itemMapping.set(-1, root);
  for (const [id, item] of itemMapping) {
    if (id === -1) continue;
    const { fatherId } = item;
    const fatherItem = itemMapping.get(fatherId);
    if (!fatherItem) {
      throw new Error(`Father node (${fatherId}) of node ${id} not found!`);
    }
    fatherItem.children.push(item);
  }
  return root;
}
