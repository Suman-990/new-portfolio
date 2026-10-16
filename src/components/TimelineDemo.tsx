import { PinContainer } from "@/components/ui/3d-pin";
import { Timeline } from "@/components/ui/timeline";
import { Trophy, Medal } from "lucide-react";
import GlassSurface from "./ui/GlassSurface";

export function TimelineDemo() {
  const projects = [
    {
      title: "Codify",
      description: "Online judge & isolated code execution sandbox",
      pinTitle: "github.com/Suman-990/codify",
      href: "https://github.com/Suman-990/codify",
      image: "/codify-project1.png",
      alt: "Codify - Online Judge & Code Execution Platform",
    },
    {
      title: "OmniScout",
      description: "Automated multi-portal job aggregation engine",
      pinTitle: "github.com/Suman-990/omniscout",
      href: "https://github.com/Suman-990/omniscout",
      image: "/omniscout-project2.png",
      alt: "OmniScout - Automated Job Aggregation Engine",
    },
    {
      title: "FinePrint",
      description: "AI-powered ingredient label scanner",
      pinTitle: "github.com/Sharan986/finePrint",
      href: "https://github.com/Sharan986/finePrint",
      image: "/fineprint-project3.webp",
      alt: "FinePrint - AI-powered ingredient label scanner",
    },
  ];

  const data = [
    {
      title: "Projects",
      content: (
        <div>
          <h4 className="mb-4 text-base sm:text-xl font-semibold tracking-tight text-paper">
            Shipped multiple projects end-to-end
          </h4>

          {/* Two cards in each row with tight gaps and edge-to-edge screenshots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-6 sm:gap-x-8 lg:gap-x-10 w-full pt-2 pb-6">
            {projects.map((project) => (
              <div
                key={project.title}
                className="h-[20rem] sm:h-[22rem] w-full flex items-center justify-center"
              >
                <PinContainer
                  title={project.pinTitle}
                  href={project.href}
                  containerClassName="w-full flex items-center justify-center"
                >
                  <div className="flex flex-col tracking-tight text-slate-100/50 w-[19rem] sm:w-[22rem] md:w-[20rem] lg:w-[22rem] xl:w-[23rem] h-[16rem] sm:h-[17.5rem]">
                    <div className="flex flex-col px-4 pt-3.5 pb-2.5">
                      <h5 className="font-bold text-base sm:text-lg text-paper tracking-wide">
                        {project.title}
                      </h5>
                      <p className="text-[11px] sm:text-xs text-dim mt-0.5 leading-snug">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex-1 w-full overflow-hidden border-t border-white/10 bg-onyx relative group">
                      <img
                        src={project.image}
                        alt={project.alt}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </PinContainer>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Experience",
      content: (
        <div>
          <h4 className="mb-2 text-base sm:text-xl font-semibold tracking-tight text-paper">
            Work Experience & Internships
          </h4>
          <p className="mb-6 text-xs sm:text-sm font-normal text-dim max-w-xl">
            Professional software engineering roles, full-stack contributions, and production deployments.
          </p>

          <div className="space-y-6 max-w-4xl pt-2">
            {/* emissio */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={24}
              borderWidth={0.06}
              brightness={45}
              opacity={0.88}
              blur={12}
              displace={0.4}
              backgroundOpacity={0.1}
              saturation={1.2}
              distortionScale={-160}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="w-full text-left transition-all duration-300 hover:scale-[1.01] hover:border-white/30"
            >
              <div className="w-full p-6 sm:p-7 space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="/emissio_in_logo.jpeg"
                      alt="emissio logo"
                      className="w-12 h-12 rounded-xl object-contain bg-white/5 p-1.5 border border-white/10 shrink-0 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h5 className="font-bold text-xl sm:text-2xl text-paper tracking-tight">
                          emissio
                        </h5>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Present
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-dim mt-0.5">
                        Software Engineer
                      </p>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-mono text-dim/80 sm:text-right shrink-0">
                    October 2026 – Present
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300/90 pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-xs mt-1 shrink-0">▹</span>
                    <span className="leading-relaxed">
                      Architected and deployed high-performance microservices and REST APIs, optimizing system throughput and request latency.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-xs mt-1 shrink-0">▹</span>
                    <span className="leading-relaxed">
                      Engineered responsive, data-intensive web interfaces with React, TypeScript, and modern component architectures.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-xs mt-1 shrink-0">▹</span>
                    <span className="leading-relaxed">
                      Built automated CI/CD deployment workflows and containerized backend services using Docker for zero-downtime releases.
                    </span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    Microservices
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    React & TypeScript
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    Docker & CI/CD
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    REST APIs
                  </span>
                </div>
              </div>
            </GlassSurface>

            {/* Mentorque */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={24}
              borderWidth={0.06}
              brightness={45}
              opacity={0.88}
              blur={12}
              displace={0.4}
              backgroundOpacity={0.1}
              saturation={1.2}
              distortionScale={-160}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="w-full text-left transition-all duration-300 hover:scale-[1.01] hover:border-white/30"
            >
              <div className="w-full p-6 sm:p-7 space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="/mentorquedu_logo.jpeg"
                      alt="Mentorque logo"
                      className="w-12 h-12 rounded-xl object-contain bg-white/5 p-1.5 border border-white/10 shrink-0 shadow-md"
                    />
                    <div>
                      <h5 className="font-bold text-xl sm:text-2xl text-paper tracking-tight">
                        Mentorque
                      </h5>
                      <p className="text-sm sm:text-base font-medium text-dim mt-0.5">
                        Full Stack Developer Intern
                      </p>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-mono text-dim/80 sm:text-right shrink-0">
                    July 2026 – September 2026
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300/90 pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-xs mt-1 shrink-0">▹</span>
                    <span className="leading-relaxed">
                      Resolved multiple production issues across frontend and backend services, including the Mentorque Chrome extension, improving platform stability and user experience.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-xs mt-1 shrink-0">▹</span>
                    <span className="leading-relaxed">
                      Implemented a client-side PDF parser, reducing document processing time from 6–7 seconds to ~0.5 seconds.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-xs mt-1 shrink-0">▹</span>
                    <span className="leading-relaxed">
                      Integrated OmniScout’s asynchronous automated job aggregation system into the Mentorque platform and developed three dedicated dashboards for monitoring and managing the feature.
                    </span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    Full Stack
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    Chrome Extension
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    PDF Parser
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                    OmniScout Pipeline
                  </span>
                </div>
              </div>
            </GlassSurface>
          </div>
        </div>
      ),
    },
    {
      title: "Achievements",
      content: (
        <div>
          <h4 className="mb-2 text-base sm:text-xl font-semibold tracking-tight text-paper">
            Competitions & Recognition
          </h4>
          <p className="mb-8 text-xs sm:text-sm font-normal text-dim max-w-xl">
            Competitive programming rankings, hackathon wins, and technical milestones.
          </p>

          <div className="space-y-6 max-w-4xl pt-2">
            {/* Achievement 1: LeetCode */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={24}
              borderWidth={0.06}
              brightness={45}
              opacity={0.88}
              blur={12}
              displace={0.4}
              backgroundOpacity={0.1}
              saturation={1.2}
              distortionScale={-160}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="w-full text-left transition-all duration-300 hover:scale-[1.01] hover:border-white/30"
            >
              <div className="w-full p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10 text-left">
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-0.5 rounded-full">
                    <Trophy className="w-3.5 h-3.5 shrink-0" />
                    <span>Competitive Programming</span>
                  </div>
                  <h5 className="text-lg sm:text-xl font-bold text-paper tracking-tight">
                    Top 0.02% Global Ranking on LeetCode
                  </h5>
                  <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed max-w-xl">
                    Achieved Top 0.02% global ranking on LeetCode by solving 837+ problems across data structures and algorithms, beating 99.8% of participants worldwide with a 73.1% acceptance rate.
                  </p>

                  {/* Quick stats badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-200">
                      837 Solved
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Beats 99.8%
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                      176 Easy · 556 Med · 105 Hard
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                      73.1% Acceptance
                    </span>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
                  <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
                    <img
                      src="/leetcode-stats.png"
                      alt="LeetCode 837 problems solved - Beats 99.8% statistics"
                      className="w-full max-w-[360px] sm:max-w-[380px] h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </GlassSurface>

            {/* Achievement 2: TechSprint Hackathon */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={24}
              borderWidth={0.06}
              brightness={45}
              opacity={0.88}
              blur={12}
              displace={0.4}
              backgroundOpacity={0.1}
              saturation={1.2}
              distortionScale={-160}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="w-full text-left transition-all duration-300 hover:scale-[1.01] hover:border-white/30"
            >
              <div className="w-full p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10 text-left">
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-0.5 rounded-full">
                    <Medal className="w-3.5 h-3.5 shrink-0" />
                    <span>Hackathon Winner</span>
                  </div>
                  <h5 className="text-lg sm:text-xl font-bold text-paper tracking-tight">
                    1st Place — TechSprint Hackathon
                  </h5>
                  <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed max-w-xl">
                    Won 1st Place at TechSprint Hackathon ("Leveraging the power of AI"), organised by Google Developer Groups (GDG) on Campus AJU & School of Engineering and IT with Team Zenux.
                  </p>

                  {/* Quick stats badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      1st Place Winner
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-200">
                      Team Zenux
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                      GDG on Campus AJU
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-400">
                      School of Engineering & IT
                    </span>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
                  <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
                    <img
                      src="/techsprint-hackathon.png"
                      alt="TechSprint Hackathon Winner Announcement - Google Developer Groups"
                      className="w-full max-w-[260px] sm:max-w-[280px] h-auto max-h-[340px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </GlassSurface>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="dark relative w-full pb-12 bg-transparent">
      <Timeline data={data} />
    </div>
  );
}
