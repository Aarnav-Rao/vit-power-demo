import { useEffect, useState } from 'react';
import './App.css';
import { FlowCanvas } from './components/FlowCanvas';
import { campusPowerNetwork } from './data/powerNetwork';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [totalLoad, setTotalLoad] = useState(0);

  useEffect(() => {
    // Calculate total load by summing up substation loads
    let load = 0;
    if (campusPowerNetwork.children) {
      campusPowerNetwork.children.forEach(sub => {
        load += sub.currentLoad;
      });
    }
    setTotalLoad(load);
  }, []);

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

        <div className="header-stats">
          <div className="stat-label">Total Campus Load</div>
          <div className="stat-value">
            {totalLoad.toLocaleString()} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>kW</span>
          </div>
        </div>
      </motion.header>

      {/* Main FlowCanvas */}
      <main>
        <FlowCanvas rootNode={campusPowerNetwork} />
      </main>

      {/* Background ambient glows */}
      <div
        style={{
          position: 'fixed',
          top: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default App;
