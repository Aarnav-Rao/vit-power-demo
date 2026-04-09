import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PowerNodeData } from '../data/powerNetwork';
import { PowerNode, TransformerVerticalSVG } from './PowerNode';

interface FlowCanvasProps {
    rootNode: PowerNodeData;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({ rootNode }) => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootNode.id]));

    const handleExpand = (id: string, isExpanded: string | boolean) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (isExpanded) {
                next.add(id);
            } else {
                next.delete(id);
                // Collapse all children if parent is collapsed
                const collapseChildren = (node: PowerNodeData) => {
                    if (node.children) {
                        node.children.forEach(child => {
                            next.delete(child.id);
                            collapseChildren(child);
                        });
                    }
                };
                // Find the node and collapse its children
                const findAndCollapse = (node: PowerNodeData) => {
                    if (node.id === id) {
                        collapseChildren(node);
                        return;
                    }
                    if (node.children) {
                        node.children.forEach(findAndCollapse);
                    }
                };
                findAndCollapse(rootNode);
            }
            return next;
        });
    };

    const renderNodeTree = (node: PowerNodeData) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);

        return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <PowerNode
                    data={node}
                    isExpanded={isExpanded}
                    onExpand={handleExpand}
                />

                <AnimatePresence>
                    {isExpanded && hasChildren && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="children-container"
                        >
                            {/* Horizontal connector line drawn between the first child's center and the last child's center */}
                            {node.children!.length > 1 && (
                                <div className="connector-horizontal" style={{
                                    left: `${100 / (node.children!.length * 2)}%`,
                                    right: `${100 / (node.children!.length * 2)}%`
                                }} />
                            )}
                            
                            {/* Parent drop line to the span */}
                            <div className="connector-parent-drop" />

                            {node.children!.map((child) => (
                                <div key={child.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Vertical connector line dropping into this child with inline Transformer */}
                                    <div className="connector-child-drop">
                                        <div style={{ width: '6px', height: '1rem', background: 'var(--accent-cyan)' }} />
                                        <TransformerVerticalSVG strokeColor="var(--accent-cyan)" />
                                        <div style={{ width: '6px', flexGrow: 1, background: 'var(--accent-cyan)', borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' }} />
                                    </div>
                                    {renderNodeTree(child)}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flow-canvas">
            <div style={{ minWidth: 'max-content', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                {renderNodeTree(rootNode)}
            </div>
        </div>
    );
};
