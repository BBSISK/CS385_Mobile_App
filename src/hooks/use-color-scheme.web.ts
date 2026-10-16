import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/** No-op subscribe: the "hydrated" flag never changes after first render. */
const emptySubscribe = () => () => {};

/**
 * Returns the device colour scheme on web.
 *
 * During static (server) rendering there is no device, so we return 'light'.
 * Once the app has hydrated in the browser we return the real value.
 * useSyncExternalStore gives us that server/client split without calling
 * setState inside an effect, which the React Compiler lint rule forbids.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
