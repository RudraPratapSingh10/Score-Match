import { useMemo } from 'react';
import { calculateChemistry } from '../services/engine-api-adapter.js';

export function useChemistry(squad) {
  return useMemo(() => {
    return calculateChemistry(squad);
  }, [squad]);
}