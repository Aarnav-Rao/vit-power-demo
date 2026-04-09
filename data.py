from gettext import install
from typing import List, Dict, Optional, Literal
from dataclasses import dataclass, field
import datetime
import random


@dataclass
class PowerDataPoint:
    time: str
    usage: int

NodeStatus = Literal['online', 'warning', 'critical']

@dataclass
class PowerNodeData:
    id: str
    name: str
    type: Literal['substation', 'transformer', 'building']
    status: NodeStatus
    currentLoad: int
    capacity: int
    voltage: str
    efficiency: float
    history: List[PowerDataPoint]
    children: Optional[List['PowerNodeData']] = field(default_factory=list)

def generate_history(base_load: int, variance: int) -> List[PowerDataPoint]:
    data = []
    now = datetime.datetime.now()
    for i in range(24, -1, -1):
        time = now - datetime.timedelta(hours=i)
        hour = time.hour
        multiplier = 1.0
        if 8 <= hour <= 20:
            multiplier = 1.3
        if 9 <= hour <= 17:
            multiplier = 1.6
            
        noise = (random.random() - 0.5) * variance
        usage = int(round(base_load * multiplier + noise))
        data.append(PowerDataPoint(time=f"{hour}:00", usage=usage))
    return data

def get_base_network() -> PowerNodeData:
    return PowerNodeData(
        id='main-sub',
        name='Main 110kV/11kV Substation',
        type='substation',
        status='online',
        currentLoad=12500,
        capacity=15000,
        voltage='110kV In / 11kV Out',
        efficiency=99.2,
        history=generate_history(8500, 500),
        children=[
            PowerNodeData(
                id='prp',
                name='PRP',
                type='substation',
                status='online',
                currentLoad=1400,
                capacity=2000,
                voltage='11kV / 400V',
                efficiency=98.5,
                history=generate_history(1000, 100)
            ),
            PowerNodeData(
                id='sjt',
                name='SJT',
                type='substation',
                status='online',
                currentLoad=2500,
                capacity=3200,
                voltage='11kV / 400V',
                efficiency=98.2,
                history=generate_history(2000, 200)
            ),
            PowerNodeData(
                id='tt',
                name='TT',
                type='substation',
                status='online',
                currentLoad=2400,
                capacity=3000,
                voltage='11kV / 400V',
                efficiency=98.6,
                history=generate_history(1900, 150),
                children=[
                    PowerNodeData(
                        id='mb',
                        name='MB',
                        type='substation',
                        status='online',
                        currentLoad=700,
                        capacity=800,
                        voltage='11kV / 400V',
                        efficiency=94.2,
                        history=generate_history(600, 100)
                    ),
                    PowerNodeData(
                        id='lh-new',
                        name='LH New',
                        type='substation',
                        status='online',
                        currentLoad=800,
                        capacity=1000,
                        voltage='11kV / 400V',
                        efficiency=97.4,
                        history=generate_history(600, 60)
                    )
                ]
            ),
            PowerNodeData(
                id='hph2',
                name='HPH2',
                type='substation',
                status='online',
                currentLoad=3800,
                capacity=4500,
                voltage='11kV / 400V',
                efficiency=98.7,
                history=generate_history(3000, 300),
                children=[
                    PowerNodeData(
                        id='hph1',
                        name='HPH1',
                        type='substation',
                        status='online',
                        currentLoad=1700,
                        capacity=2000,
                        voltage='11kV / 400V',
                        efficiency=96.5,
                        history=generate_history(1300, 150)
                    ),
                    PowerNodeData(
                        id='hph3',
                        name='HPH3',
                        type='substation',
                        status='online',
                        currentLoad=1000,
                        capacity=1200,
                        voltage='11kV / 400V',
                        efficiency=98.1,
                        history=generate_history(800, 80)
                    )
                ]
            ),
            PowerNodeData(
                id='mh-chiller',
                name='Chiller Plaza',
                type='building',
                status='warning',
                currentLoad=1200,
                capacity=1300,
                voltage='11kV / 400V',
                efficiency=93.2,
                history=generate_history(1000, 250)
            ),
            PowerNodeData(
                id='st-ps',
                name='S+T',
                type='building',
                status='online',
                currentLoad=1200,
                capacity=1500,
                voltage='11kV / 400V',
                efficiency=97.5,
                history=generate_history(900, 100)
            )
        ]
    )

def simulate_live_usage(node: PowerNodeData) -> PowerNodeData:
    """Recursively update node values to simulate live traffic."""
    node.currentLoad = max(0, min(node.capacity, int(round(node.currentLoad + (node.capacity * (random.random() * 0.04 - 0.02))))))
    node.efficiency = min(99.9, max(85.0, round(node.efficiency + (random.random() * 0.4 - 0.2), 1)))
    
    # Update History Graph Tail manually
    node.history[-1] = PowerDataPoint(time=node.history[-1].time, usage=node.currentLoad)
    
    if node.children:
        for child in node.children:
            simulate_live_usage(child)
            
    return node

def calculate_total_load(node: PowerNodeData) -> int:
    if not node.children:
        return node.currentLoad
    total = sum(calculate_total_load(child) for child in node.children)
    node.currentLoad = total
    return total
