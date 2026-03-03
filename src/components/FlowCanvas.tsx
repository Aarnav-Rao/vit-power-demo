import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PowerNodeData } from '../data/powerNetwork';
import { PowerNode } from './PowerNode';

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
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

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

                            {node.children!.map((child) => (
                                <div key={child.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Vertical connector down to this child */}
                                    <div className="connector-line">
                                        <div className="pulse-line" />
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
        <div className="flow-canvas" style={{ width: '100%', overflowX: 'auto', padding: '2rem 0' }}>
            {renderNodeTree(rootNode)}
        </div>
    );
};
