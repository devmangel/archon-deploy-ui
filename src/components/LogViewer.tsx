'use client';

import { useState, useEffect, useRef } from 'react';
import { ActivityLog } from '@prisma/client';

interface LogViewerProps {
  logs: ActivityLog[];
  height?: string;
  autoScroll?: boolean;
}

export default function LogViewer({
  logs,
  height = 'h-96',
  autoScroll = true,
}: LogViewerProps) {
  const [filter, setFilter] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug':
        return 'text-zinc-500';
      case 'info':
        return 'text-blue-400';
      case 'warn':
        return 'text-amber-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug':
        return '🔍';
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '•';
    }
  };

  const filteredLogs =
    filter === 'all' ? logs : logs.filter((log) => log.level === filter);

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
      {/* Filter Bar */}
      <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Activity Log</span>
          <span className="text-xs text-zinc-500">({filteredLogs.length})</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {['all', 'info', 'warn', 'error'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1 rounded font-mono transition-colors ${
                filter === level
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={scrollRef}
        className={`${height} overflow-y-auto font-mono text-sm p-4 space-y-2`}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-zinc-600 py-8">
            No logs to display
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 py-1 hover:bg-zinc-900/50 px-2 -mx-2 rounded transition-colors"
            >
              <span className="text-xs">
                {getLevelIcon(log.level)}
              </span>
              <span className="text-xs text-zinc-500 min-w-[80px]">
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
              <span className={`flex-1 ${getLevelColor(log.level)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
