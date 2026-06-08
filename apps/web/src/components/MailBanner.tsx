export function MailBanner() {
  return (
    <div
      role="banner"
      className="border-b-2 border-seal bg-[#fdf0e6] text-ink text-sm"
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
        {/* Postmark SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#c75d4a" strokeWidth="2"
            strokeDasharray="2 2" />
          <text x="12" y="14" fontSize="8" textAnchor="middle" fill="#c75d4a"
            fontWeight="bold">SRY</text>
        </svg>
        <span>
          <strong className="text-seal">做嘴笨助手,</strong>
          <span className="ml-1">不做道歉信发送器</span>
        </span>
      </div>
    </div>
  );
}
