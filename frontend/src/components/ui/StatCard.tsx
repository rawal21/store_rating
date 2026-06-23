import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string; // tailwind bg class for the icon wrapper
}

/** Animates the number counting up from 0 to value on mount */
const useCountUp = (target: number, duration = 800) => {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
};

const StatCard = ({ label, value, icon, color }: StatCardProps) => {
  const count = useCountUp(value);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
          {count.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
