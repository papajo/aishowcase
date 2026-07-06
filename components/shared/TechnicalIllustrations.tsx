import React from "react"

interface IllustrationProps {
  className?: string
}

// Background dot grid pattern for the illustrations
function GridBackground() {
  return (
    <>
      <defs>
        <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="fill-zinc-300 dark:fill-zinc-800" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </>
  )
}

export function ElectricGridIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 400"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Schematic lines */}
      <path d="M 50,300 L 750,300 M 50,150 L 750,150" strokeDasharray="5 5" className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1" />
      
      {/* Tower Left */}
      <g transform="translate(180, 80)">
        <path
          d="M 40,240 L 80,40 L 120,240 Z M 80,40 L 80,240 M 40,240 L 120,40 M 40,40 L 120,240 M 20,80 L 140,80 M 10,140 L 150,140"
          fill="none"
          className="stroke-zinc-500 dark:stroke-zinc-400"
          strokeWidth="2"
        />
        {/* Transmission Lines hanging from Left Tower */}
        <path d="M -180,60 Q -90,140 10,80 M -180,120 Q -90,190 10,140" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" strokeDasharray="3 3" />
      </g>

      {/* Tower Right */}
      <g transform="translate(480, 80)">
        <path
          d="M 40,240 L 80,40 L 120,240 Z M 80,40 L 80,240 M 40,240 L 120,40 M 40,40 L 120,240 M 20,80 L 140,80 M 10,140 L 150,140"
          fill="none"
          className="stroke-zinc-500 dark:stroke-zinc-400"
          strokeWidth="2"
        />
        {/* Transmission Lines middle */}
        <path d="M -190,80 Q -90,160 10,80 M -170,140 Q -90,210 10,140" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" />
        {/* Transmission Lines to Right edge */}
        <path d="M 120,80 Q 220,130 320,80 M 130,140 Q 220,180 320,135" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" strokeDasharray="3 3" />
      </g>
      
      {/* Accent Overlay / Technical notes */}
      <text x="30" y="50" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[10px]">TOWER_GRID_SYS // PWR_LINK_08</text>
      <text x="700" y="370" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[10px] text-right">CAP_300KV</text>
    </svg>
  )
}

export function DatabasePerformanceIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Downward performance/load arrows */}
      <g transform="translate(40, 20)">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${i * 65}, 10)`}>
            {/* Database Silo */}
            <path
              d="M 10,60 C 10,50 40,50 40,50 C 40,50 70,50 70,60 L 70,120 C 70,130 40,130 40,130 C 40,130 10,130 10,120 Z"
              fill="none"
              className="stroke-zinc-500 dark:stroke-zinc-400"
              strokeWidth="2"
            />
            <path d="M 10,80 C 10,70 40,70 40,70 C 40,70 70,70 70,80 M 10,100 C 10,90 40,90 40,90 C 40,90 70,90 70,100" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" />
            
            {/* Load Arrow */}
            <path d="M 40,10 L 40,40 M 35,30 L 40,40 L 45,30" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="2" />
          </g>
        ))}
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">LOAD_BALANCE // DB_IOPS</text>
    </svg>
  )
}

export function GearsIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Gears */}
      <g transform="translate(200, 100)" className="stroke-zinc-500 dark:stroke-zinc-400 fill-none" strokeWidth="2">
        {/* Main Big Gear */}
        <circle r="40" />
        <circle r="15" />
        {[...Array(12)].map((_, i) => (
          <path
            key={i}
            d="M 0,-40 L -8,-40 L -6,-52 L 6,-52 L 8,-40 Z"
            transform={`rotate(${i * 30})`}
          />
        ))}
        {/* Spokes */}
        {[...Array(4)].map((_, i) => (
          <line key={i} x1="0" y1="-40" x2="0" y2="40" transform={`rotate(${i * 45})`} className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
        ))}
      </g>

      <g transform="translate(105, 125)" className="stroke-zinc-400 dark:stroke-zinc-500 fill-none" strokeWidth="1.5">
        {/* Medium Gear Left */}
        <circle r="25" />
        <circle r="8" />
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d="M 0,-25 L -5,-25 L -4,-33 L 4,-33 L 5,-25 Z"
            transform={`rotate(${i * 45 + 15})`}
          />
        ))}
      </g>

      <g transform="translate(285, 65)" className="stroke-zinc-400 dark:stroke-zinc-500 fill-none" strokeWidth="1.5">
        {/* Medium Gear Right */}
        <circle r="25" />
        <circle r="8" />
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d="M 0,-25 L -5,-25 L -4,-33 L 4,-33 L 5,-25 Z"
            transform={`rotate(${i * 45 + 15})`}
          />
        ))}
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">PHYSICAL_AI // EDGE_DRIVE</text>
    </svg>
  )
}

export function DatabaseLockIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      <g transform="translate(160, 30)">
        {/* PostgreSQL Silo stack */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0, ${i * 40})`}>
            <path
              d="M 0,20 C 0,10 80,10 80,10 C 80,10 160,10 160,20 L 160,50 C 160,60 80,60 80,60 C 80,60 0,60 0,50 Z"
              fill="none"
              className="stroke-zinc-500 dark:stroke-zinc-400"
              strokeWidth="2"
            />
            {/* Database slots */}
            <line x1="20" y1="35" x2="60" y2="35" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
            <line x1="100" y1="35" x2="140" y2="35" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
          </g>
        ))}
        
        {/* Floating Lock Icon overlay */}
        <g transform="translate(-40, 45)" className="stroke-zinc-600 dark:stroke-zinc-300 fill-zinc-100 dark:fill-zinc-800">
          <rect x="0" y="15" width="26" height="20" rx="3" strokeWidth="2" />
          <path d="M 6,15 L 6,10 C 6,5 20,5 20,10 L 20,15" fill="none" strokeWidth="2" />
          <circle cx="13" cy="25" r="2" className="fill-zinc-600 dark:fill-zinc-300" />
        </g>
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">DB_SECURE_AUTH // PG_SEC</text>
    </svg>
  )
}

export function FactoryDatabaseIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Factory and Database Transfer */}
      <g transform="translate(60, 60)" className="stroke-zinc-500 dark:stroke-zinc-400 fill-none" strokeWidth="2">
        {/* Factory */}
        <path d="M 10,70 L 10,40 L 30,55 L 30,40 L 50,55 L 50,40 L 70,55 L 70,70 Z" />
        <rect x="25" y="55" width="10" height="15" />
        <line x1="45" y1="15" x2="45" y2="40" strokeWidth="1.5" />
        {/* Smoke puffs */}
        <circle cx="45" cy="10" r="3" className="stroke-none fill-zinc-300 dark:fill-zinc-700" />
      </g>

      {/* Transfer arrow */}
      <g transform="translate(160, 90)" className="stroke-zinc-400 dark:stroke-zinc-500 fill-none" strokeWidth="2">
        <line x1="0" y1="0" x2="70" y2="0" />
        <path d="M 60,-5 L 70,0 L 60,5" />
      </g>

      {/* Database Silo */}
      <g transform="translate(260, 50)" className="stroke-zinc-500 dark:stroke-zinc-400 fill-none" strokeWidth="2">
        <path d="M 10,20 C 10,10 45,10 45,10 C 45,10 80,10 80,20 L 80,70 C 80,80 45,80 45,80 C 45,80 10,80 10,70 Z" />
        <path d="M 10,35 C 10,25 45,25 45,25 C 45,25 80,25 80,35 M 10,52 C 10,42 45,42 45,42 C 45,42 80,42 80,52" />
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">NAMESPACE // SRC_SYNC</text>
    </svg>
  )
}

export function TimeDelayIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      <g transform="translate(100, 50)">
        {/* Terminal/LED display box */}
        <rect x="0" y="0" width="200" height="100" rx="6" className="fill-zinc-100 dark:fill-zinc-950 stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="2" />
        
        {/* Text grid inside */}
        <text x="100" y="35" textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[10px] tracking-widest">TIME DELAY</text>
        <text x="100" y="80" textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-100 font-mono text-3xl font-bold tracking-wider">2.27s</text>
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">MONITOR // LATENCY_TEST</text>
    </svg>
  )
}

export function RowVsColumnarIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Left side: Row Storage */}
      <g transform="translate(50, 60)">
        <text x="0" y="-10" className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[9px]">ROW STORAGE</text>
        <rect x="0" y="0" width="110" height="70" rx="4" fill="none" className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(5, ${i * 22 + 5})`}>
            {/* Row structure */}
            <rect x="0" y="0" width="100" height="16" rx="2" className="fill-zinc-200/50 dark:fill-zinc-800/50 stroke-zinc-400 dark:stroke-zinc-600" strokeWidth="1" />
            <line x1="30" y1="0" x2="30" y2="16" className="stroke-zinc-300 dark:stroke-zinc-700" />
            <line x1="65" y1="0" x2="65" y2="16" className="stroke-zinc-300 dark:stroke-zinc-700" />
          </g>
        ))}
      </g>

      {/* Comparison question mark */}
      <text x="200" y="105" textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500 font-mono text-xl font-bold">?</text>

      {/* Right side: Columnar Storage */}
      <g transform="translate(240, 60)">
        <text x="0" y="-10" className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[9px]">COLUMNAR STORAGE</text>
        <rect x="0" y="0" width="110" height="70" rx="4" fill="none" className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 35 + 5}, 5)`}>
            {/* Column structure */}
            <rect x="0" y="0" width="30" height="60" rx="2" className="fill-zinc-200/50 dark:fill-zinc-800/50 stroke-zinc-400 dark:stroke-zinc-600" strokeWidth="1" />
            <line x1="0" y1="20" x2="30" y2="20" className="stroke-zinc-300 dark:stroke-zinc-700" />
            <line x1="0" y1="40" x2="30" y2="40" className="stroke-zinc-300 dark:stroke-zinc-700" />
          </g>
        ))}
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">STORAGE_LAYOUT // ANALYTICS</text>
    </svg>
  )
}

export function LaptopClockIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Laptop Wireframe */}
      <g transform="translate(100, 50)">
        {/* Screen */}
        <rect x="30" y="10" width="140" height="85" rx="6" fill="none" className="stroke-zinc-500 dark:stroke-zinc-400" strokeWidth="2" />
        {/* Base */}
        <path d="M 10,95 L 190,95 L 175,110 L 25,110 Z" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="2" />
        <rect x="90" y="96" width="20" height="5" className="fill-zinc-300 dark:fill-zinc-700" />
        
        {/* Floating Clock Overlay */}
        <g transform="translate(130, 45)" className="stroke-zinc-600 dark:stroke-zinc-300 fill-zinc-100 dark:fill-zinc-800">
          <circle cx="20" cy="20" r="18" strokeWidth="2" />
          <path d="M 20,8 L 20,20 L 28,24" fill="none" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">SCHEDULER // CAL_DB</text>
    </svg>
  )
}

export function PlantFloorIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Plant machinery schema */}
      <g transform="translate(80, 50)" className="stroke-zinc-500 dark:stroke-zinc-400 fill-none" strokeWidth="2">
        {/* Conveyor Belt */}
        <rect x="0" y="60" width="240" height="15" rx="7" />
        <circle cx="20" cy="67" r="4" className="fill-zinc-400 dark:fill-zinc-600" />
        <circle cx="80" cy="67" r="4" className="fill-zinc-400 dark:fill-zinc-600" />
        <circle cx="140" cy="67" r="4" className="fill-zinc-400 dark:fill-zinc-600" />
        <circle cx="220" cy="67" r="4" className="fill-zinc-400 dark:fill-zinc-600" />

        {/* Machinery Tower */}
        <path d="M 40,60 L 40,20 L 70,20 L 70,60" />
        <path d="M 160,60 L 160,10 L 190,10 L 190,60" />
        
        {/* Hydraulic Pistons */}
        <rect x="48" y="30" width="14" height="20" className="fill-zinc-200/50 dark:fill-zinc-800/50" />
        <rect x="168" y="25" width="14" height="25" className="fill-zinc-200/50 dark:fill-zinc-800/50" />
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">INDUSTRIAL_IOT // DATA_STREAM</text>
    </svg>
  )
}

export function ApexAnalyticsIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}
    >
      <GridBackground />
      {/* Apex Dashboard */}
      <g transform="translate(80, 50)">
        <rect x="0" y="0" width="240" height="100" rx="6" fill="none" className="stroke-zinc-500 dark:stroke-zinc-400" strokeWidth="2" />
        {/* APEX header */}
        <rect x="0" y="0" width="240" height="24" rx="2" className="fill-zinc-200/50 dark:fill-zinc-800/50 stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1.5" />
        <text x="120" y="16" textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-200 font-mono text-[10px] font-bold tracking-widest">APEX // ANALYTICS</text>
        
        {/* Graph bars */}
        <g transform="translate(30, 40)" className="stroke-zinc-400 dark:stroke-zinc-500 fill-zinc-300/50 dark:fill-zinc-700/50" strokeWidth="1.5">
          <rect x="0" y="25" width="20" height="20" />
          <rect x="30" y="10" width="20" height="35" />
          <rect x="60" y="18" width="20" height="27" />
          <rect x="90" y="5" width="20" height="40" />
          <rect x="120" y="15" width="20" height="30" />
          <rect x="150" y="30" width="20" height="15" />
        </g>
      </g>
      <text x="20" y="30" className="fill-zinc-400 dark:fill-zinc-600 font-mono text-[9px]">BI_METRICS // DASHBOARD</text>
    </svg>
  )
}
