import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/engine-api-adapter.js';

export function useRecommendations(squad) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const res = getRecommendations(squad);
    setRecommendations(res);
    setLoading(false);
  }, [squad]);

  return { recommendations, loading };
}