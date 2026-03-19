import { useState } from "react";
import { AppSidebar, Screen } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { ProjectList } from "@/components/ProjectList";
import { ProjectView } from "@/components/ProjectView";
import { InputProject } from "@/components/InputProject";
import { AIChatBubble } from "@/components/AIChatBubble";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("input");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);

  const handleSelectProject = (id: string) => {
    setSelectedProject(id);
    setShowNewProject(false);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setShowNewProject(true);
  };

  const handleBack = () => {
    setSelectedProject(null);
    setShowNewProject(false);
  };

  const renderScreen = () => {
    if (screen === "input") {
      if (selectedProject) {
        return <ProjectView projectId={selectedProject} onBack={handleBack} />;
      }
      if (showNewProject) {
        return <InputProject onSubmit={() => handleSelectProject("new")} />;
      }
      return <ProjectList onSelectProject={handleSelectProject} onNewProject={handleNewProject} />;
    }
    // For other sidebar items, just show the project view with the right tab
    if (selectedProject) {
      return <ProjectView projectId={selectedProject} onBack={handleBack} />;
    }
    return <ProjectList onSelectProject={handleSelectProject} onNewProject={handleNewProject} />;
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar active={screen} onNavigate={(s) => { setScreen(s); setSelectedProject(null); setShowNewProject(false); }} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar projectName={selectedProject ? "Greenfield Residential Complex — Mumbai" : "BuildSmart AI — Dashboard"} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderScreen()}
        </main>
      </div>
      <AIChatBubble />
    </div>
  );
};

export default Index;
