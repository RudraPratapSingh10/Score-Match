import { useState, useEffect } from 'react';
import { FORMATIONS } from '../constants/formations.js';

const POSITION_ROLE_FIT = {
  GK: ['Goalkeeper', 'Sweeper Keeper'],
  CB: ['Guard', 'Protector', 'Commander', 'Explorer'],
  LB: ['Guard', 'Explorer', 'Engine', 'Protector', 'Infiltrator'],
  RB: ['Guard', 'Explorer', 'Engine', 'Protector', 'Infiltrator'],
  LWB: ['Engine', 'Producer', 'Infiltrator', 'Explorer'],
  RWB: ['Engine', 'Producer', 'Infiltrator', 'Explorer'],
  DM: ['Commander', 'Guard', 'Engine', 'Protector'],
  CM: ['Commander', 'Engine', 'Producer', 'Architect'],
  AM: ['Architect', 'Producer', 'Prowler', 'Menace'],
  LM: ['Producer', 'Engine', 'Infiltrator', 'Architect'],
  RM: ['Producer', 'Engine', 'Infiltrator', 'Architect'],
  LW: ['Speedster', 'Intruder', 'Infiltrator', 'Menace'],
  RW: ['Speedster', 'Intruder', 'Infiltrator', 'Menace'],
  CF: ['Prowler', 'Speedster', 'Hammer', 'Intruder', 'Menace'],
  ST: ['Hammer', 'Prowler', 'Speedster', 'Intruder', 'Menace']
};

export function useSquad() {
  const [playerPool, setPlayerPool] = useState([
    { id: 'p1', name: 'Rudra', type: 'Speedster', level: 9 },
    { id: 'p2', name: 'Player 2', type: 'Guard', level: 8 },
    { id: 'p3', name: 'Player 3', type: 'Protector', level: 8 },
    { id: 'p4', name: 'Player 4', type: 'Producer', level: 7 },
    { id: 'p5', name: 'Player 5', type: 'Engine', level: 8 },
    { id: 'p6', name: 'Player 6', type: 'Commander', level: 9 },
    { id: 'p7', name: 'Player 7', type: 'Prowler', level: 9 },
    { id: 'p8', name: 'Player 8', type: 'Hammer', level: 7 },
    { id: 'p9', name: 'Player 9', type: 'Intruder', level: 8 },
    { id: 'p10', name: 'Player 10', type: 'Goalkeeper', level: 8 },
    { id: 'p11', name: 'Player 11', type: 'Architect', level: 7 },
    { id: 'p12', name: 'Player 12', type: 'Menace', level: 6 },
  ]);

  const [formationId, setFormationId] = useState('4-3-3');
  const [squad, setSquad] = useState({ formation: '4-3-3', players: [] });

  const optimizeSquad = (currentFormationId, currentPool) => {
    // Check if FORMATIONS exists and find formation
    const selectedFmt = FORMATIONS?.find(f => f.id === currentFormationId) || FORMATIONS?.[0];
    
    // Safety check: slots target
    const slots = selectedFmt?.slots || [];
    const availablePlayers = [...(currentPool || [])];

    // Safe mapping with fallback
    const assignedPlayers = slots.map((slot) => {
      let bestIndex = -1;
      let highestScore = -1;

      availablePlayers.forEach((p, idx) => {
        const preferredRoles = POSITION_ROLE_FIT[slot.position] || [];
        const roleRank = preferredRoles.indexOf(p.type);
        
        let score = (p.level || 1) * 10;
        if (roleRank !== -1) {
          score += (preferredRoles.length - roleRank) * 15;
        }

        if (score > highestScore) {
          highestScore = score;
          bestIndex = idx;
        }
      });

      let pickedPlayer = { name: 'Unassigned', type: 'Guard', level: 1 };
      if (bestIndex !== -1) {
        pickedPlayer = availablePlayers.splice(bestIndex, 1)[0];
      }

      return {
        id: slot.id,
        position: slot.position,
        x: slot.x,
        y: slot.y,
        playerId: pickedPlayer.id,
        name: pickedPlayer.name,
        type: pickedPlayer.type,
        level: pickedPlayer.level
      };
    });

    setSquad({
      formation: currentFormationId,
      players: assignedPlayers
    });
  };

  useEffect(() => {
    optimizeSquad(formationId, playerPool);
  }, [formationId, playerPool]);

  const addInventoryPlayer = (player) => {
    setPlayerPool(prev => [...prev, { ...player, id: `p_${Date.now()}` }]);
  };

  const removeInventoryPlayer = (id) => {
    setPlayerPool(prev => prev.filter(p => p.id !== id));
  };

  const updateInventoryPlayer = (id, updatedData) => {
    setPlayerPool(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const updateFormation = (newFmtId) => {
    setFormationId(newFmtId);
  };

  const resetSquad = () => {
    setFormationId('4-3-3');
  };

  return {
    squad,
    setSquad,
    playerPool,
    addInventoryPlayer,
    removeInventoryPlayer,
    updateInventoryPlayer,
    updateFormation,
    resetSquad,
    autoOptimize: () => optimizeSquad(formationId, playerPool)
  };
}