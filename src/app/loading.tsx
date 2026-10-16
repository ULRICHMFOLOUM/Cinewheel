export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080a0f] text-white">
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.2) 0%, rgba(245,158,11,0.08) 35%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Animated Cinema Reel & Portal Spinner */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          {/* Outer rotating neon dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/70 animate-spin" style={{ animationDuration: "8s" }} />
          
          {/* Reverse counter-rotating amber ring */}
          <div className="absolute inset-2 rounded-full border border-amber-400/50 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
          
          {/* Pulsating Center Glow */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 shadow-[0_0_35px_rgba(220,38,38,0.8)] animate-pulse">
            <svg
              className="h-7 w-7 text-white fill-white ml-0.5"
              viewBox="0 0 24 24"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Title Shimmer */}
        <h2 className="text-xl font-extrabold tracking-wider text-white">
          KAIJU<span className="text-red-500">STREAM</span>
        </h2>
        <p className="mt-1.5 text-xs text-white/50 tracking-widest uppercase">
          Chargement cinématique haute définition...
        </p>

        {/* Shimmer loading bar */}
        <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full bg-gradient-to-r from-red-600 via-amber-400 to-red-600"
            style={{
              animation: "shimmer 1.8s infinite linear",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        {/* Cameroon Low-Data badge */}
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Optimisation bande passante mobile (Afrique centrale)</span>
        </div>
      </div>
    </div>
  );
}
