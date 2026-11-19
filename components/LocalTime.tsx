'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/content';

/** Live local time in the designer's time zone, updated on the minute. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: site.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return (
    <span className="tabular">
      {time ?? '--:--'} {site.timeZoneLabel}
    </span>
  );
}
