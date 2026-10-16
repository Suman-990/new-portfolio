import { useState } from "react";
import { ShieldCheck, ExternalLink, GripVertical } from "lucide-react";
import Shredder, { type ShredderItem } from "./ui/Shredder";
import { WorldMap } from "./ui/WorldMap";

interface ProfileItem extends ShredderItem {
  name: string;
  handle: string;
  url: string;
  iconType?: "svg" | "img";
  iconSrc?: string;
  accent: string;
  bg: string;
}

const INITIAL_PROFILES: ProfileItem[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "in/suman990",
    url: "https://www.linkedin.com/in/suman990",
    iconType: "img",
    iconSrc: "/LinkedIn_icon.svg.webp",
    accent: "#0a66c2",
    bg: "#131c2e",
  },
  {
    id: "github",
    name: "GitHub",
    handle: "@Suman-990",
    url: "https://github.com/Suman-990",
    iconType: "img",
    iconSrc: "/github_transparent.png",
    accent: "#38bdf8",
    bg: "#18181b",
  },
  {
    id: "leetcode",
    name: "LeetCode",
    handle: "@Suman_990",
    url: "https://leetcode.com/u/Suman_990/",
    iconType: "img",
    iconSrc: "/leetcode.webp",
    accent: "#ffa116",
    bg: "#221c16",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "+91 9064961649",
    url: "https://wa.me/919064961649",
    iconType: "svg",
    accent: "#25d366",
    bg: "#0e2e1e",
  },
  {
    id: "email",
    name: "Email",
    handle: "sumanmahanty.99@gmail.com",
    url: "mailto:sumanmahanty.99@gmail.com",
    iconType: "svg",
    accent: "#ea4335",
    bg: "#2a1515",
  },
];

export default function Contact() {
  const [profiles, setProfiles] = useState<ProfileItem[]>(INITIAL_PROFILES);

  return (
    <section
      id="contact"
      className="relative w-full py-14 sm:py-20 pb-20 sm:pb-28 text-paper bg-transparent"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
        {/* Minimal Section Heading (No status pill) */}
        <header className="mb-6 sm:mb-8 border-b border-white/10 pb-4 sm:pb-5">
          <p className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase mb-1">
            GLOBAL REACH / CONNECT
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            CONTACT.
          </h2>
        </header>

        {/* Two-Column Grid: Dotted World Map (Left) + Shredder Profiles (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-20">
          {/* Left Column: 3D Dotted World Map (No card wrapper, seamless on background) */}
          <div className="lg:col-span-7 flex flex-col justify-start w-full relative z-20 pt-2 sm:pt-1">
            <WorldMap
              locationText="I am here"
              lat={22.8}
              lng={86.2}
              className="w-full max-w-[640px]"
            />
          </div>

          {/* Right Column: Shredder Interactive Profiles */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start w-full">
            {/* Header: Verified Profiles */}
            <div className="w-full max-w-[360px] mb-4 flex items-center gap-2 px-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-mono font-semibold tracking-wider text-paper uppercase">
                Verified Profiles
              </span>
            </div>

            {/* Shredder Component with click-to-redirect and falling from top animation */}
            <div className="relative flex justify-center w-full max-w-[360px] mx-auto">
              <Shredder
                items={profiles}
                onReorder={(reordered) => setProfiles(reordered)}
                renderItem={(item) => (
                  <div
                    className="w-full h-[54px] rounded-xl border border-white/10 hover:border-white/30 shadow-lg px-3.5 py-1.5 flex items-center justify-between transition-all select-none group cursor-pointer"
                    style={{
                      backgroundColor: item.bg,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                    }}
                  >
                    {/* Left: Logo & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon container */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center p-1.5 shrink-0 border border-white/10 shadow-inner"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
                      >
                        {item.iconType === "img" && item.iconSrc ? (
                          <img
                            src={item.iconSrc}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : item.id === "whatsapp" ? (
                          /* Official WhatsApp SVG */
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-[#25d366]"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        ) : (
                          /* Official Gmail SVG */
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#EA4335"
                              d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Platform Name & Handle */}
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-white tracking-wide truncate block">
                          {item.name}
                        </span>
                        <p className="text-[11px] font-mono text-muted truncate mt-0.5">
                          {item.handle}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-muted hover:text-white transition-all"
                        title={`Open ${item.name} profile`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>

                      <div className="text-white/30 group-hover:text-white/60 transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}
                width={360}
                height={420}
                feedSpeed={190}
                bite={20}
                stripWidth={10}
                curl={1}
                autoAnimate={false}
                loop={false}
                loopAfterDelete={true}
                fallHeight={80}
                inset={14}
                gap={8}
                slitHeight={4}
                autoFeed={true}
                dragTilt={6}
                lift={1.03}
                slitColor="#27272a"
                color="#f5f5f5"
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
