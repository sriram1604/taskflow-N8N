"use client"
import { useState, useCallback, useMemo } from 'react';
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    type Node, 
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection, 
    Background,
    Controls,
    MiniMap,
    Panel
} from '@xyflow/react';

import { ErrorView, LoadingView } from "@/components/entity-components"
import {useSuspenseWorkflow} from "@/features/workflows/hooks/use-workflows"

import { nodeComponents } from '@/config/node-components';
import '@xyflow/react/dist/style.css';
import { AddNodeButton } from './add-node-button';
import { useSetAtom } from 'jotai';
import { editorAtom } from '../store/atoms';
import { NodeType } from '@/generated/prisma';
import { ExecuteWorkflowButton } from './execute-workflow-button';

export const EditorLoading = () => {
    return <LoadingView message="Loading editor..."/>
}

export const EditorError = () => {
    return (
        <ErrorView message="Failed to load workflow"/>
    )
}
// const initialNodes = [
//   { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
//   { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
//   { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3' } },
//   { id: 'n4', position: { x: 0, y: 300 }, data: { label: 'Node 4' } },
// ];

// const initialEdges = [
//   { id: 'n1-n2', source: 'n1', target: 'n2' },
//   { id: 'n2-n3', source: 'n2', target: 'n3' },
//   { id: 'n3-n4', source: 'n3', target: 'n4' },
// ];

export const Editor = ({workflowId} : {workflowId: string}) => {
    const {
        data: workflow
    } = useSuspenseWorkflow(workflowId);

    const setEditorInstance = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

    
    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect} 
                nodeTypes={nodeComponents}
                onInit={setEditorInstance}
                fitView
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
                panOnDrag = {false}
                selectionOnDrag
                deleteKeyCode={['Backspace', 'Delete']}
                multiSelectionKeyCode={['Control', 'Meta', 'Shift']}
            >
                <Background/>
                <Controls/>
                <MiniMap/>
                <Panel position="top-right">
                    <AddNodeButton/>
                </Panel>
                {hasManualTrigger && (
                    <Panel position="bottom-center">
                        <ExecuteWorkflowButton workflowId={workflowId}/>
                    </Panel>
                )}
            </ReactFlow>
        </div>
    )
}

