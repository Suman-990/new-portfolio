import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  FileCode, 
  FileJson, 
  FileText, 
  File, 
  Settings, 
  Search, 
  GitBranch, 
  Blocks,
  X,
  Lock
} from "lucide-react";

interface SkillCategory {
  varName: string
  label: string
  items: string[]
  extension: string
  iconColor: string
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    varName: "languages",
    label: "programming languages",
    items: ["C", "Java", "JavaScript", "TypeScript", "Golang", "HTML5", "CSS3"],
    extension: "ts",
    iconColor: "#3178c6"
  },
  {
    varName: "frameworks",
    label: "libraries & frameworks",
    items: ["Spring Boot", "Node.js", "Express.js", "React", "React Native", "Tailwind CSS"],
    extension: "tsx",
    iconColor: "#61dafb"
  },
  {
    varName: "tools",
    label: "developer tools",
    items: ["Linux", "Git", "Docker"],
    extension: "sh",
    iconColor: "#4eaa25"
  },
  {
    varName: "cloud",
    label: "cloud & infra",
    items: ["RabbitMQ", "Apache Kafka", "AWS S3", "AWS EC2", "AWS RDS"],
    extension: "yml",
    iconColor: "#f78c6c"
  },
  {
    varName: "databases",
    label: "databases",
    items: ["MongoDB", "PostgreSQL", "Redis"],
    extension: "sql",
    iconColor: "#c3e88d"
  },
  {
    varName: "focus",
    label: "core focus",
    items: ["Data Structures & Algorithms", "Full-Stack Development", "Android Development"],
    extension: "md",
    iconColor: "#82aaff"
  },
];

const FileIcon = ({ extension, color }: { extension: string; color: string }) => {
  switch (extension) {
    case "ts":
    case "tsx":
      return <FileCode size={14} color={color} />;
    case "json":
      return <FileJson size={14} color={color} />;
    case "sh":
    case "yml":
    case "sql":
      return <File size={14} color={color} />;
    case "md":
      return <FileText size={14} color={color} />;
    default:
      return <File size={14} color={color} />;
  }
};

export default function VSCodeWindow() {
  const [activeTab, setActiveTab] = useState(SKILL_CATEGORIES[0].varName);
  const [openTabs, setOpenTabs] = useState<string[]>([SKILL_CATEGORIES[0].varName, SKILL_CATEGORIES[1].varName]);
  const [isSrcOpen, setIsSrcOpen] = useState(true);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(true);
  const [isNodeModulesOpen, setIsNodeModulesOpen] = useState(false);
  const [isPublicOpen, setIsPublicOpen] = useState(false);

  const openFile = (varName: string) => {
    if (!openTabs.includes(varName)) {
      setOpenTabs([...openTabs, varName]);
    }
    setActiveTab(varName);
  };

  const closeTab = (e: React.MouseEvent, varName: string) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== varName);
    setOpenTabs(newTabs);
    if (activeTab === varName) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : "");
    }
  };

  const activeCategory = SKILL_CATEGORIES.find(c => c.varName === activeTab);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[550px] bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl text-[#cccccc] font-sans">
      {/* Title Bar */}
      <div className="relative h-9 flex items-center justify-between px-4 bg-[#323233] border-b border-[#181818] select-none w-full">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-[12px] text-gray-400 absolute left-1/2 transform -translate-x-1/2 flex items-center pointer-events-none w-full justify-center">
          <img src="/Visual_Studio_Code_1.35_icon.svg.webp" alt="VS Code" className="w-4 h-4 mr-2" />
          Suman-portfolio - Visual Studio Code
        </div>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6 border-r border-[#181818]">
          <FileCode size={24} className="text-white cursor-pointer opacity-100" />
          <Search size={24} className="text-gray-400 hover:text-white cursor-pointer opacity-60 transition-opacity" />
          <GitBranch size={24} className="text-gray-400 hover:text-white cursor-pointer opacity-60 transition-opacity" />
          <Blocks size={24} className="text-gray-400 hover:text-white cursor-pointer opacity-60 transition-opacity" />
          <div className="flex-1"></div>
          <Settings size={24} className="text-gray-400 hover:text-white cursor-pointer opacity-60 transition-opacity" />
        </div>

        {/* Sidebar */}
        <div className="w-56 bg-[#252526] flex flex-col border-r border-[#181818] select-none overflow-y-auto">
          <div className="px-5 py-3 text-[11px] font-semibold text-gray-400 tracking-wider">
            EXPLORER
          </div>
          
          <div className="flex flex-col text-[13px]">
            <div 
              className="flex items-center px-1 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-300 font-bold"
              onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
            >
              {isPortfolioOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
              SUMAN-PORTFOLIO
            </div>
            
            {isPortfolioOpen && (
              <>
            <div 
              className="flex items-center px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-400"
              onClick={() => setIsNodeModulesOpen(!isNodeModulesOpen)}
            >
              {isNodeModulesOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
              <span className="flex-1">node_modules</span>
              <Lock size={12} className="opacity-40" />
            </div>
            <div 
              className="flex items-center px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-400"
              onClick={() => setIsPublicOpen(!isPublicOpen)}
            >
              {isPublicOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
              <span className="flex-1">public</span>
              <Lock size={12} className="opacity-40" />
            </div>
            
            <div 
              className="flex items-center px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-300"
              onClick={() => setIsSrcOpen(!isSrcOpen)}
            >
              {isSrcOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
              src
            </div>
            
            {isSrcOpen && (
              <div className="flex flex-col pb-2">
                {SKILL_CATEGORIES.map(category => {
                  const isActive = activeTab === category.varName;
                  return (
                    <div 
                      key={category.varName}
                      className={`flex items-center px-8 py-1 cursor-pointer ${isActive ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-400'}`}
                      onClick={() => openFile(category.varName)}
                    >
                      <div className="mr-2">
                        <FileIcon extension={category.extension} color={category.iconColor} />
                      </div>
                      <span className="truncate">{category.varName}.{category.extension}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="flex items-center px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-400 mt-2">
              <FileIcon extension="json" color="#cb3837" />
              <span className="ml-2 flex-1">package.json</span>
              <Lock size={12} className="opacity-40" />
            </div>
            <div className="flex items-center px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-400">
              <FileIcon extension="md" color="#82aaff" />
              <span className="ml-2 flex-1">README.md</span>
              <Lock size={12} className="opacity-40" />
            </div>
            </>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
          {/* Tabs */}
          <div className="flex h-9 bg-[#252526] overflow-x-auto custom-scrollbar">
            {openTabs.map(tabId => {
              const category = SKILL_CATEGORIES.find(c => c.varName === tabId);
              if (!category) return null;
              const isActive = activeTab === tabId;
              
              return (
                <div 
                  key={tabId}
                  className={`flex items-center min-w-[120px] max-w-[200px] h-full px-3 cursor-pointer border-r border-[#1e1e1e] group ${isActive ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#2d2d2d]/80 border-t-2 border-t-transparent'}`}
                  onClick={() => setActiveTab(tabId)}
                >
                  <FileIcon extension={category.extension} color={category.iconColor} />
                  <span className="ml-2 text-[13px] truncate flex-1">{category.varName}.{category.extension}</span>
                  <div 
                    className={`ml-2 rounded-md p-[2px] ${isActive ? 'opacity-100 hover:bg-[#333333]' : 'opacity-0 group-hover:opacity-100 hover:bg-[#444444]'}`}
                    onClick={(e) => { e.stopPropagation(); closeTab(e, tabId); }}
                  >
                    <X size={14} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Breadcrumbs */}
          {activeCategory && (
            <div className="h-6 flex items-center px-4 text-[12px] text-gray-500 bg-[#1e1e1e] border-b border-[#2d2d2d]">
              <span>src</span>
              <ChevronRight size={12} className="mx-1" />
              <span>{activeCategory.varName}.{activeCategory.extension}</span>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 overflow-auto p-4 font-mono text-[14px] leading-relaxed custom-scrollbar relative bg-[#1e1e1e]">
            {activeCategory ? (
              <div className="flex">
                <div className="flex flex-col text-[#858585] select-none text-right pr-4 border-r border-[#404040] mr-4 min-w-[30px]">
                  {Array.from({length: activeCategory.items.length + 4}).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1">
                  <pre className="font-mono m-0">
                    <code>
                      <span className="text-[#6a9955]">{`// ${activeCategory.label}`}</span>
                      {"\n"}
                      <span className="text-[#569cd6]">const</span>{" "}
                      <span className="text-[#4fc1ff]">{activeCategory.varName}</span>{" "}
                      <span className="text-[#d4d4d4]">=</span>{" "}
                      <span className="text-[#d4d4d4]">[</span>
                      {activeCategory.items.map((item, idx) => (
                        <span key={item}>
                          {"\n  "}
                          <span className="text-[#ce9178]">{`"${item}"`}</span>
                          <span className="text-[#d4d4d4]">{idx < activeCategory.items.length - 1 ? ',' : ''}</span>
                        </span>
                      ))}
                      {"\n"}
                      <span className="text-[#d4d4d4]">];</span>
                    </code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#858585]">
                <div className="text-center">
                  <div className="text-6xl mb-4 font-light">Suman-portfolio</div>
                  <div className="text-sm">Select a file from the explorer to view its contents</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center cursor-pointer hover:bg-white/20 px-1 rounded">
            <GitBranch size={12} className="mr-1" /> main
          </div>
          <div className="flex items-center cursor-pointer hover:bg-white/20 px-1 rounded">
            <div className="w-2 h-2 rounded-full bg-white mr-1"></div> 0  <div className="w-2 h-2 bg-white ml-2 mr-1 transform rotate-45"></div> 0
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">Ln 1, Col 1</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">Spaces: 2</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">UTF-8</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">LF</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">{activeCategory?.extension === 'tsx' ? 'TypeScript React' : activeCategory?.extension === 'ts' ? 'TypeScript' : 'JSON'}</div>
        </div>
      </div>
    </div>
  );
}
