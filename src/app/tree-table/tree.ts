export interface TreeRawData<T> {
    id: string;
    parent?: string;
    data: T;
}

export class TreeNode<T> {
    id!: string;
    data!: T;
    children?: TreeNode<T>[];
    parent?: TreeNode<T>;
}

export class Tree<T> {
    rootNodes: TreeNode<T>[];
    nodesMap: { [key: string]: TreeNode<T> };

    static generateTree<T>(definedValues: readonly TreeRawData<T>[]): Tree<T> {
        const tree = new Tree<T>();
        let remainingValues = definedValues;
        while (remainingValues.length > 0) {
            const newRemainingValues = [];
            for (const value of remainingValues) {
                if (value.id in tree.nodesMap) {
                    console.error('Encountered duplicate id when generating tree:', value.id);
                    continue;
                }
                const node: TreeNode<T> = {
                    id: value.id,
                    data: value.data,
                };
                if (!value.parent) {
                    tree.pushNode(node);
                } else {
                    const parent = tree.nodesMap[value.parent];
                    if (parent) {
                        tree.pushNode(node, parent);
                    } else {
                        newRemainingValues.push(value);
                    }
                }
            }
            if (remainingValues.length === newRemainingValues.length) {
                console.error('Failed to find parents for the following nodes:', remainingValues);
                break;
            } else {
                remainingValues = newRemainingValues;
            }
        }
        return tree;
    }

    private constructor() {
        this.rootNodes = [];
        this.nodesMap = {};
    }

    findById(id: string): TreeNode<T> {
        return this.nodesMap[id];
    }

    find(
        predicate: (node: TreeNode<T>) => boolean,
        rootNodes: TreeNode<T>[] = this.rootNodes,
    ): TreeNode<T>[] {
        let foundNodes: TreeNode<T>[] = [];
        for (const node of rootNodes) {
            if (predicate(node)) {
                foundNodes.push(node);
            }
            if (node.children) {
                foundNodes = [...foundNodes, ...this.find(predicate, node.children)];
            }
        }
        return foundNodes;
    }

    *iterate(rootNodes: TreeNode<T>[] = this.rootNodes): Generator<TreeNode<T>> {
        for (const node of rootNodes) {
            yield node;
            if (node.children) {
                for (const childNode of this.iterate(node.children)) {
                    yield childNode;
                }
            }
        }
    }

    getAncestors(node: TreeNode<T>): TreeNode<T>[] {
        const ancestors: TreeNode<T>[] = [];
        let currentNode: TreeNode<T> | undefined = node;
        while (currentNode) {
            ancestors.push(currentNode);
            currentNode = currentNode.parent;
        }
        return ancestors;
    }

    getData(id: string): T {
        const node = this.nodesMap[id];
        if (!node) {
            throw new Error(`Failed to get data: node with id "${id}" does not exist`);
        }
        return node.data;
    }

    private pushNode(node: TreeNode<T>, parent?: TreeNode<T>): void {
        this.nodesMap[node.id] = node;
        if (parent) {
            node.parent = parent;
            if (parent.children) {
                parent.children.push(node);
            } else {
                parent.children = [node];
            }
        } else {
            this.rootNodes.push(node);
        }
    }
}
