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
  name: 'VIT Main 110/33kV Substation',
  type: 'substation',
  status: 'online',
  currentLoad: 12500,
  capacity: 15000,
  voltage: '110kV In / 33kV Out',
  efficiency: 98.5,
  history: generateHistory(8500, 500),
  children: [
    {
      id: 'acad-zone',
      name: 'Academic Zone Substation',
      type: 'substation',
      status: 'online',
      currentLoad: 5200,
      capacity: 7000,
      voltage: '33kV In / 11kV Out',
      efficiency: 97.2,
      history: generateHistory(3500, 300),
      children: [
        {
          id: 'sjt',
          name: 'Silver Jubilee Tower (SJT)',
          type: 'building',
          status: 'online',
          currentLoad: 1800,
          capacity: 2500,
          voltage: '11kV In / 415V Out',
          efficiency: 96.5,
          history: generateHistory(1200, 150),
        },
        {
          id: 'tt',
          name: 'Technology Tower (TT)',
          type: 'building',
          status: 'warning',
          currentLoad: 2100,
          capacity: 2200,
          voltage: '11kV In / 415V Out',
          efficiency: 94.0,
          history: generateHistory(1500, 200),
        },
        {
          id: 'mb',
          name: 'Main Building (MB)',
          type: 'building',
          status: 'online',
          currentLoad: 900,
          capacity: 1500,
          voltage: '11kV In / 415V Out',
          efficiency: 97.8,
          history: generateHistory(600, 100),
        }
      ]
    },
    {
      id: 'hostel-zone',
      name: 'Hostel Zone Substation',
      type: 'substation',
      status: 'online',
      currentLoad: 4800,
      capacity: 6000,
      voltage: '33kV In / 11kV Out',
      efficiency: 98.1,
      history: generateHistory(4000, 400),
      children: [
        {
          id: 'mens-hostel',
          name: 'Men\'s Hostel Blocks',
          type: 'building',
          status: 'online',
          currentLoad: 2600,
          capacity: 3500,
          voltage: '11kV In / 415V Out',
          efficiency: 96.9,
          history: generateHistory(2200, 250),
        },
        {
          id: 'womens-hostel',
          name: 'Women\'s Hostel Blocks',
          type: 'building',
          status: 'online',
          currentLoad: 1900,
          capacity: 2500,
          voltage: '11kV In / 415V Out',
          efficiency: 97.5,
          history: generateHistory(1500, 150),
        }
      ]
    },
    {
      id: 'fac-zone',
      name: 'Facilities & Admin Zone',
      type: 'substation',
      status: 'online',
      currentLoad: 2100,
      capacity: 3000,
      voltage: '33kV In / 11kV Out',
      efficiency: 95.5,
      history: generateHistory(1800, 100),
      children: [
        {
          id: 'food-court',
          name: 'Food Court & Amenities',
          type: 'building',
          status: 'warning',
          currentLoad: 1200,
          capacity: 1300,
          voltage: '11kV In / 415V Out',
          efficiency: 92.1,
          history: generateHistory(1000, 300),
        },
        {
          id: 'library',
          name: 'Central Library',
          type: 'building',
          status: 'online',
          currentLoad: 800,
          capacity: 1200,
          voltage: '11kV In / 415V Out',
          efficiency: 98.2,
          history: generateHistory(600, 50),
        }
      ]
    }
  ]
};
