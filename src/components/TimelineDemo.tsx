import { PinContainer } from "@/components/ui/3d-pin";
import { Timeline } from "@/components/ui/timeline";

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
          <h4 className="mb-4 text-base sm:text-xl font-semibold tracking-tight text-paper">
            Work Experience & Internships
          </h4>
          <p className="text-xs sm:text-sm font-normal text-dim max-w-xl">
            Professional software engineering roles, full-stack contributions, and production deployments.
          </p>
        </div>
      ),
    },
    {
      title: "Achievements",
      content: (
        <div>
          <h4 className="mb-4 text-base sm:text-xl font-semibold tracking-tight text-paper">
            Competitions & Recognition
          </h4>
          <p className="text-xs sm:text-sm font-normal text-dim max-w-xl">
            Competitive programming rankings, hackathon wins, and technical milestones.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="dark relative w-screen overflow-clip bg-onyx ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] -mb-16 pb-16">
      <Timeline data={data} />
    </div>
  );
}
