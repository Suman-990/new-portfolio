const TECH = [
  "React",
  "TypeScript",
  "Node.js",
  "Spring Boot",
  "Docker",
  "PostgreSQL",
  "AWS",
]

function TechStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-14 md:justify-between">
      {TECH.map((tech) => (
        <span
          key={tech}
          className="text-sm font-medium tracking-wide text-muted/70"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}

export default TechStrip
