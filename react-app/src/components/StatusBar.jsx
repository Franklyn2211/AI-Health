// StatusBar — the top status bar of the phone mockup
export default function StatusBar() {
  return (
    <div className="h-[34px] flex items-center justify-between px-[22px] text-[12px] font-[800] bg-[#f8faf7] relative z-[5]">
      <span>9:41</span>
      {/* Status icons: dot + wifi bars + battery */}
      <div className="flex gap-[5px] items-end" aria-hidden="true">
        {/* Signal dot */}
        <span className="block w-[5px] h-[5px] rounded-full bg-[#1f2e2b]" />
        {/* Wifi bar */}
        <span className="block w-[13px] h-[8px] rounded-[2px] bg-[#1f2e2b]" />
        {/* Battery */}
        <span className="block w-[16px] h-[9px] rounded-[2px] bg-[#1f2e2b]" />
      </div>
    </div>
  );
}
