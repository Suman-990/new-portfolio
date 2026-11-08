import type { FileType } from "./types";

export function MacOSFolderIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="folderBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4bb2ff" />
          <stop offset="100%" stopColor="#0a84ff" />
        </linearGradient>
        <linearGradient id="folderFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5ac8fa" />
          <stop offset="100%" stopColor="#0071e3" />
        </linearGradient>
        <filter id="folderShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>
      {/* Back tab */}
      <path
        d="M6 14C6 9.58172 9.58172 6 14 6H34C37.5 6 40.5 8.5 42.5 12L46 18H86C90.4183 18 94 21.5817 94 26V68C94 72.4183 90.4183 76 86 76H14C9.58172 76 6 72.4183 6 68V14Z"
        fill="url(#folderBack)"
      />
      {/* Light tab highlight */}
      <path
        d="M14 8H33L37 15H14C10.5 15 8 12.5 8 9.5C8 8.5 9 8 14 8Z"
        fill="white"
        fillOpacity="0.3"
      />
      {/* Front body with slight angle */}
      <rect
        x="6"
        y="22"
        width="88"
        height="53"
        rx="8"
        fill="url(#folderFront)"
        filter="url(#folderShadow)"
      />
      {/* Subtle top edge shine */}
      <line x1="12" y1="23.5" x2="88" y2="23.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MacOSPdfIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="docShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
        <linearGradient id="pdfRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff453a" />
          <stop offset="100%" stopColor="#d70015" />
        </linearGradient>
      </defs>
      {/* Page Base */}
      <path
        d="M10 6C10 2.68629 12.6863 0 16 0H52L74 22V94C74 97.3137 71.3137 100 68 100H16C12.6863 100 10 97.3137 10 94V6Z"
        fill="#f8f9fa"
        filter="url(#docShadow)"
      />
      {/* Folded Corner */}
      <path d="M52 0V16C52 19.3137 54.6863 22 58 22H74L52 0Z" fill="#d1d5db" />
      
      {/* Text Lines */}
      <rect x="20" y="32" width="40" height="3" rx="1.5" fill="#9ca3af" />
      <rect x="20" y="40" width="34" height="3" rx="1.5" fill="#d1d5db" />
      <rect x="20" y="48" width="38" height="3" rx="1.5" fill="#d1d5db" />
      
      {/* PDF Red Badge */}
      <rect x="14" y="62" width="52" height="24" rx="4" fill="url(#pdfRibbon)" />
      <text
        x="40"
        y="78"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
        letterSpacing="0.5"
      >
        PDF
      </text>
    </svg>
  );
}

export function MacOSDocIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="mdDocShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
      </defs>
      <path
        d="M10 6C10 2.68629 12.6863 0 16 0H52L74 22V94C74 97.3137 71.3137 100 68 100H16C12.6863 100 10 97.3137 10 94V6Z"
        fill="#f8f9fa"
        filter="url(#mdDocShadow)"
      />
      <path d="M52 0V16C52 19.3137 54.6863 22 58 22H74L52 0Z" fill="#d1d5db" />
      
      {/* Markdown / text header */}
      <rect x="20" y="32" width="28" height="4" rx="2" fill="#0071e3" />
      <rect x="20" y="42" width="42" height="3" rx="1.5" fill="#9ca3af" />
      <rect x="20" y="50" width="38" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="20" y="58" width="40" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="20" y="66" width="24" height="3" rx="1.5" fill="#cbd5e1" />

      {/* Blue MD Badge */}
      <rect x="20" y="78" width="26" height="12" rx="3" fill="#0071e3" />
      <text
        x="33"
        y="87"
        textAnchor="middle"
        fill="white"
        fontSize="7.5"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        MD
      </text>
    </svg>
  );
}

export function MacOSVCardIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="vcardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
      </defs>
      <rect x="10" y="10" width="60" height="80" rx="8" fill="#ffffff" filter="url(#vcardShadow)" />
      <rect x="10" y="10" width="60" height="24" rx="8" fill="#30b0c7" />
      <circle cx="40" cy="28" r="9" fill="white" />
      <circle cx="40" cy="25" r="4" fill="#30b0c7" />
      <path d="M34 35C34 32 37 31 40 31C43 31 46 32 46 35H34Z" fill="#30b0c7" />
      <rect x="22" y="46" width="36" height="3.5" rx="1.5" fill="#374151" />
      <rect x="26" y="54" width="28" height="2.5" rx="1" fill="#9ca3af" />
      <rect x="20" y="63" width="40" height="2" rx="1" fill="#e5e7eb" />
      <rect x="20" y="69" width="35" height="2" rx="1" fill="#e5e7eb" />
      <rect x="20" y="75" width="28" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

export function MacOSUrlIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="urlDocShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
      </defs>
      <path
        d="M10 6C10 2.68629 12.6863 0 16 0H52L74 22V94C74 97.3137 71.3137 100 68 100H16C12.6863 100 10 97.3137 10 94V6Z"
        fill="#f8f9fa"
        filter="url(#urlDocShadow)"
      />
      <path d="M52 0V16C52 19.3137 54.6863 22 58 22H74L52 0Z" fill="#d1d5db" />
      {/* Compass / Web sphere */}
      <circle cx="40" cy="54" r="16" fill="#0071e3" />
      <circle cx="40" cy="54" r="14" fill="#5ac8fa" />
      <polygon points="40,43 45,54 40,65 35,54" fill="#ff3b30" />
      <polygon points="40,43 35,54 40,65" fill="#f8f9fa" />
      <circle cx="40" cy="54" r="2.5" fill="#ffffff" />
    </svg>
  );
}

export function FinderItemIcon({
  type,
  thumbnail,
  className = "w-12 h-12",
}: {
  type: FileType;
  thumbnail?: string;
  className?: string;
}) {
  if (thumbnail && type === "image") {
    return (
      <div className={`relative rounded-md overflow-hidden shadow-md border border-white/20 bg-black/40 flex items-center justify-center ${className}`}>
        <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
      </div>
    );
  }

  switch (type) {
    case "folder":
      return <MacOSFolderIcon className={className} />;
    case "pdf":
      return <MacOSPdfIcon className={className} />;
    case "markdown":
      return <MacOSDocIcon className={className} />;
    case "vcard":
      return <MacOSVCardIcon className={className} />;
    case "link":
      return <MacOSUrlIcon className={className} />;
    case "image":
      return (
        <div className={`relative rounded-md overflow-hidden shadow-md border border-white/20 bg-neutral-800 flex items-center justify-center ${className}`}>
          <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    default:
      return <MacOSDocIcon className={className} />;
  }
}
