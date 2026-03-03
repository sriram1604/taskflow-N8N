import toposort from "toposort";
import { type Node, Connection } from "@/generated/prisma";

export const topologicalSort = (
    nodes : Node[], 
    connections : Connection[],
): Node[] => {

    if(connections.length === 0){
        return nodes;
    }

    
    

    const edges : [string,string][] = connections.map((conn)=> [conn.fromNodeId,conn.toNodeId]);
    const nodeIds = new Set<string>();

    for(const conn of connections){
        nodeIds.add(conn.fromNodeId);
        nodeIds.add(conn.toNodeId);
    }
    
    for( const node of nodes){
        if(!nodeIds.has(node.id)){
            edges.push([node.id, node.id]);
        }
    }

    let sortedIds: string[];

    try {
        sortedIds = toposort(edges);
        sortedIds = [...new Set(sortedIds)];
    } catch (error) {
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow contains a cycle")
        }

        throw error;
    }

    const nodeMap = new Map(nodes.map((n)=> [n.id,n]));

    return sortedIds.map((id) => nodeMap.get(id)!).filter(Boolean);
    
}