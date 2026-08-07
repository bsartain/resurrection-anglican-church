"use client";

import { useEffect, useState } from "react";
import { countdownTo, describeCountdown, nextServiceOccurrence, parseServiceTime, type CountdownParts } from "@/app/lib/serviceTime";

interface Props {
  /** The Keystatic `serviceTime` string, e.g. "Sundays at 4:00 PM". */
  readonly serviceTime?: string | null;
}

interface Tick {
  readonly countdown: CountdownParts;
  readonly inProgress: boolean;
  readonly label: string;
}

export default function NextServiceCountdown({ serviceTime }: Readonly<Props>) {
  // Nothing is rendered on the server: the answer depends on the current time,
  // and a server-rendered value would be stale and would mismatch on hydration.
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    const schedule = parseServiceTime(serviceTime);

    const update = () => {
      const now = new Date();
      const occurrence = nextServiceOccurrence(now, schedule);
      setTick({
        countdown: countdownTo(occurrence.start, now),
        inProgress: occurrence.inProgress,
        label: schedule.label,
      });
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [serviceTime]);

  if (!tick) {
    return <div className="next-service" aria-hidden="true" />;
  }

  if (tick.inProgress) {
    return (
      <div className="next-service next-service--live" aria-live="polite">
        <span className="next-service-pulse" aria-hidden="true" />
        <div>
          <p className="next-service-eyebrow">Happening now</p>
          <p className="next-service-headline">We&rsquo;re gathered for worship &mdash; come join us.</p>
        </div>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = tick.countdown;
  const units = [
    { value: days, label: days === 1 ? "day" : "days" },
    { value: hours, label: hours === 1 ? "hour" : "hours" },
    { value: minutes, label: minutes === 1 ? "min" : "mins" },
    { value: seconds, label: "sec" },
  ];

  return (
    <div className="next-service">
      <p className="next-service-eyebrow">Next service</p>
      {/* The clock updates every second; announcing each tick would flood a
          screen reader, so the summary line carries the accessible answer. */}
      <p className="next-service-headline">
        {tick.label} &mdash; <span className="next-service-relative">{describeCountdown(tick.countdown)}</span>
      </p>
      <div className="next-service-clock" aria-hidden="true">
        {units.map((unit) => (
          <div key={unit.label} className="next-service-unit">
            <span className="next-service-value">{String(unit.value).padStart(2, "0")}</span>
            <span className="next-service-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
