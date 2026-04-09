import { useEffect, useState } from 'react';
import './App.css';
import { FlowCanvas } from './components/FlowCanvas';
import { CampusPieChart } from './components/CampusPieChart';
import { campusPowerNetwork } from './data/powerNetwork';
import type { PowerNodeData } from './data/powerNetwork';
import { Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to deeply clone and mutate the network data
const simulateLiveUsage = (node: PowerNodeData): PowerNodeData => {
  const newNode = { ...node };

  // Fluctuate current load by +/- 2% 
  const fluctuation = newNode.capacity * (Math.random() * 0.04 - 0.02);
  newNode.currentLoad = Math.max(0, Math.min(newNode.capacity, Math.round(newNode.currentLoad + fluctuation)));

  // Recalculate efficiency slightly
  newNode.efficiency = Math.min(99.9, Math.max(85.0, +(newNode.efficiency + (Math.random() * 0.4 - 0.2)).toFixed(1)));

  // Update history array: remove oldest, add new data point if needed
  // For visual sake of this demo, we can just let it fluctuate live without aggressively destroying the array
  // So we just update the last element's usage to match the new currentLoad to see the graph tip move.
  const newHistory = [...newNode.history];
  newHistory[newHistory.length - 1] = {
    ...newHistory[newHistory.length - 1],
    usage: newNode.currentLoad
  };
  newNode.history = newHistory;

  if (newNode.children) {
    newNode.children = newNode.children.map(simulateLiveUsage);
  }

  return newNode;
};

// Helper to sum up all total load from the network
const calculateTotalLoad = (node: PowerNodeData): number => {
  if (!node.children || node.children.length === 0) {
    return node.currentLoad;
  }
  return node.children.reduce((acc, child) => acc + calculateTotalLoad(child), 0);
};

function App() {
  const [networkData, setNetworkData] = useState<PowerNodeData>(campusPowerNetwork);
  const [totalLoad, setTotalLoad] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Data simulation effect (updates every 2.5 seconds)
  useEffect(() => {
    const dataTimer = setInterval(() => {
      setNetworkData(prevData => {
        const newData = simulateLiveUsage(prevData);
        // Force the root node to be the sum of its children for realism
        if (newData.children) {
          newData.currentLoad = calculateTotalLoad(newData);
        }
        return newData;
      });
    }, 2500);

    return () => clearInterval(dataTimer);
  }, []);

  // Sync total load to the header
  useEffect(() => {
    setTotalLoad(networkData.currentLoad);
  }, [networkData]);

  return (
    <div className="app-container">
      {/* Premium Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="header"
      >
        <div className="header-title">
          <h1>
            <Zap className="icon" size={28} />
            VIT Vellore Power Grid
          </h1>
          <p>Interactive Transmission flow & Usage Analytics</p>
        </div>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div className="header-stats" style={{ textAlign: 'left' }}>
            <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} /> Live Timestamp
            </div>
            <div className="stat-value" style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }}>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          <div className="header-stats">
            <div className="stat-label">Total Campus Load</div>
            <div className="stat-value">
              {totalLoad.toLocaleString()} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>kW</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main FlowCanvas */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FlowCanvas rootNode={networkData} />
        {/* Pass down the live networkData to the pie chart as well */}
        <CampusPieChart networkData={networkData} />
      </main>

    </div>
  );
}

export default App;
