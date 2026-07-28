import React, { createContext, useState, useEffect } from 'react';

export const SquadContext = createContext(null);

const DEFAULT_SQUAD = {
  formation: '4-4-2',
  players: [
    { id: 'p1', type: 'Guard', level: 8, position: 'GK' },
    { id: 'p2', type: 'Guard', level: 7, position: 'CB' },
    { id: 'p3', type: 'Protector', level: 8, position: 'CB' },
    { id: 'p4', type: 'Engine', level: 9, position: 'LM' },
    { id: 'p5', type: 'Commander', level: 7, position: 'CM' },
    { id: 'p6', type: 'Producer', level: 8, position: 'CM' },
    { id: 'p7', type: 'Prowler', level: 7, position: 'RM' },
    { id: 'p8', type: 'Speedster', level: 10, position: 'CF' },
    { id: 'p9', type: 'Intruder', level: 8, position: 'ST' },
    { id: 'p10', type: 'Hammer', level: 9, position: 'LB' },
    { id: 'p11', type: 'Architect', level: 7, position: 'RB' }
  ]
};

export function SquadProvider({ children }) {
  const [squad, setSquad] = useState(() => {
    const saved = localStorage.getItem('sm_squad');
    return saved ? JSON.parse(saved) : DEFAULT_SQUAD;
  });

  useEffect(() => {
    localStorage.setItem('sm_squad', JSON.stringify(squad));
  }, [squad]);

  const updateFormation = (formation) => {
    setSquad(prev => ({ ...prev, formation }));
  };

  const updatePlayer = (id, updatedPlayer) => {
    setSquad(prev => ({
      ...prev,
      players: prev.players.map(p => (p.id === id ? { ...p, ...updatedPlayer } : p))
    }));
  };

  const resetSquad = () => {
    setSquad(DEFAULT_SQUAD);
  };

  return (
    <SquadContext.Provider value={{ squad, setSquad, updateFormation, updatePlayer, resetSquad }}>
      {children}
    </SquadContext.Provider>
  );
}