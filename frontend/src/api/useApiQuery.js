import { useQuery } from '@tanstack/react-query';
import { getContent } from '../data/contentRepository';

export function useApiQuery(queryKey, endpoint, options = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getContent(endpoint),
    ...options,
  });
}
