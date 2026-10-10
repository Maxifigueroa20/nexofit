import { useState, useEffect, useRef } from 'react';

export default function useSSE(onEvent) {
  const [isConnected, setIsConnected] = useState(false);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (onEventRef.current) {
          onEventRef.current(payload);
        }
      } catch (err) {
        console.error(err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { isConnected };
}
