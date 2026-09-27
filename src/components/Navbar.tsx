const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
]

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 11L11 3M11 3H4.5M11 3V9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Navbar() {
  return (
    <header className="flex items-center justify-between py-8">
      <a href="#home" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-paper">
          S
        </span>
        <span className="text-lg font-semibold tracking-tight text-ink">
          Suman
        </span>
      </a>

      <nav className="hidden items-center gap-9 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
      >
        Let&apos;s talk
        <ArrowIcon />
      </a>
    </header>
  )
}

export default Navbar
