import {CollectionTreeNode} from "./meta-api.service";

export interface CollectionTreeNodeEntry extends CollectionTreeNode{
    title: string;
    level: number;
}
export class Tree {
    static flatten<T extends CollectionTreeNodeEntry>(flat: CollectionTreeNode[], collector: T[] = [], level = 1): T[] {
        flat.forEach((f) => {
            const entry = f as T ;
            entry.level = level;
            collector.push(entry);
            this.flatten(entry.children, collector, level + 1);
        })
        return collector;

    }
}
