export type NodeStatus = 'online' | 'warning' | 'critical';

export interface PowerDataPoint {
  time: string;
  usage: number; // kW
}

export interface PowerNodeData {
  id: string;
  name: string;
  type: 'substation' | 'transformer' | 'building';
  status: NodeStatus;
  currentLoad: number; // kW
  capacity: number; // kW
  voltage: string; // e.g., '33kV', '415V'
  efficiency: number; // %
  history: PowerDataPoint[];
  children?: PowerNodeData[];
}

const generateHistory = (baseLoad: number, variance: number): PowerDataPoint[] => {
  const data: PowerDataPoint[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    // Add some random variance to the base load, higher during day (hours 8-20)
    const hour = time.getHours();
    let multiplier = 1;
    if (hour >= 8 && hour <= 20) multiplier = 1.3;
    if (hour >= 9 && hour <= 17) multiplier = 1.6;

    const noise = (Math.random() - 0.5) * variance;
    data.push({
      time: `${time.getHours()}:00`,
      usage: Math.round(baseLoad * multiplier + noise),
    });
  }
  return data;
};

export const campusPowerNetwork: PowerNodeData = {
  id: 'main-sub',
  name: 'Main 110kV/11kV Substation',
  type: 'substation',
  status: 'online',
  currentLoad: 12500,
  capacity: 15000,
  voltage: '110kV In / 11kV Out',
  efficiency: 99.2,
  history: generateHistory(8500, 500),
  children: [
    {
      id: 'line1',
      name: 'Feeder 1: New MH',
      type: 'substation',
      status: 'online',
      currentLoad: 2400,
      capacity: 3000,
      voltage: '11kV',
      efficiency: 98.4,
      history: generateHistory(1800, 200),
      children: [
        {
          id: 'new-mh-ss',
          name: 'New MH SS',
          type: 'building',
          status: 'online',
          currentLoad: 1200,
          capacity: 1500,
          voltage: '11kV / 400V',
          efficiency: 97.5,
          history: generateHistory(900, 100),
        },
        {
          id: 'mh-chiller',
          name: 'MH Chiller Plant',
          type: 'building',
          status: 'warning',
          currentLoad: 1200,
          capacity: 1300,
          voltage: '11kV / 400V',
          efficiency: 93.2,
          history: generateHistory(1000, 250),
        }
      ]
    },
    {
      id: 'line2',
      name: 'Feeder 2: M HSP',
      type: 'substation',
      status: 'online',
      currentLoad: 3800,
      capacity: 4500,
      voltage: '11kV',
      efficiency: 98.7,
      history: generateHistory(3000, 300),
      children: [
        {
          id: 'm-hsp-3',
          name: 'M HSP 3 (2x Trafo)',
          type: 'transformer',
          status: 'online',
          currentLoad: 1000,
          capacity: 1200,
          voltage: '11kV / 400V',
          efficiency: 98.1,
          history: generateHistory(800, 80),
        },
        {
          id: 'm-hsp-2',
          name: 'M HSP 2 (2x Trafo)',
          type: 'transformer',
          status: 'online',
          currentLoad: 1100,
          capacity: 1300,
          voltage: '11kV / 400V',
          efficiency: 97.9,
          history: generateHistory(900, 90),
        },
        {
          id: 'm-hsp-1',
          name: 'M HSP 1 (4x Trafo)',
          type: 'transformer',
          status: 'online',
          currentLoad: 1700,
          capacity: 2000,
          voltage: '11kV / 400V',
          efficiency: 96.5,
          history: generateHistory(1300, 150),
        }
      ]
    },
    {
      id: 'line3',
      name: 'Feeder 3: PRP',
      type: 'substation',
      status: 'online',
      currentLoad: 1400,
      capacity: 2000,
      voltage: '11kV',
      efficiency: 99.0,
      history: generateHistory(1000, 100),
      children: [
        {
          id: 'prp-tf',
          name: 'PRP (11kV/400V, 2x Trafo)',
          type: 'transformer',
          status: 'online',
          currentLoad: 1400,
          capacity: 2000,
          voltage: '11kV / 400V',
          efficiency: 98.5,
          history: generateHistory(1000, 100),
        }
      ]
    },
    {
      id: 'line4',
      name: 'Feeder 4: SJT',
      type: 'substation',
      status: 'online',
      currentLoad: 2500,
      capacity: 3200,
      voltage: '11kV',
      efficiency: 98.2,
      history: generateHistory(2000, 200),
      children: [
        {
          id: 'sjt-chiller',
          name: 'SJT Chiller Plant (2x Trafo)',
          type: 'transformer',
          status: 'online',
          currentLoad: 1400,
          capacity: 1800,
          voltage: '11kV / 400V',
          efficiency: 95.8,
          history: generateHistory(1100, 150),
        },
        {
          id: 'sjt-ss',
          name: 'SJT SS (2x Trafo)',
          type: 'substation',
          status: 'online',
          currentLoad: 1100,
          capacity: 1400,
          voltage: '11kV / 400V',
          efficiency: 97.6,
          history: generateHistory(900, 100),
        }
      ]
    },
    {
      id: 'line5',
      name: 'Feeder 5: TT & Others',
      type: 'substation',
      status: 'online',
      currentLoad: 2400,
      capacity: 3000,
      voltage: '11kV',
      efficiency: 98.6,
      history: generateHistory(1900, 150),
      children: [
        {
          id: 'tt-ss',
          name: 'TT SS (2x Trafo)',
          type: 'substation',
          status: 'online',
          currentLoad: 900,
          capacity: 1200,
          voltage: '11kV / 400V',
          efficiency: 98.0,
          history: generateHistory(700, 50),
        },
        {
          id: 'lh-new',
          name: 'LH New (2x Trafo)',
          type: 'substation',
          status: 'online',
          currentLoad: 800,
          capacity: 1000,
          voltage: '11kV / 400V',
          efficiency: 97.4,
          history: generateHistory(600, 60),
        },
        {
          id: 'mb-ss',
          name: 'MB SS (2x Trafo)',
          type: 'substation',
          status: 'warning',
          currentLoad: 700,
          capacity: 800,
          voltage: '11kV / 400V',
          efficiency: 94.2,
          history: generateHistory(600, 100),
        }
      ]
    }
  ]
};
