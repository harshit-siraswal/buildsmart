import { useState } from "react";
import { AppSidebar, Screen } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { InputProject } from "@/components/InputProject";
import { CostEstimation } from "@/components/CostEstimation";
import { ResourcePlanning } from "@/components/ResourcePlanning";
import { TimelineGantt } from "@/components/TimelineGantt";
import { AIChatBubble } from "@/components/AIChatBubble";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("input");

  const renderScreen = () => {
    switch (screen) {
      case "input":
        return <InputProject onSubmit={() => setScreen("cost")} />;
      case "cost":
        return <CostEstimation onNext={() => setScreen("resource")} />;
      case "resource":
        return <ResourcePlanning onNext={() => setScreen("timeline")} />;
      case "timeline":
        return <TimelineGantt />;
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar active={screen} onNavigate={setScreen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar projectName="Greenfield Residential Complex — Mumbai" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderScreen()}
        </main>
      </div>
      <AIChatBubble />
    </div>
  );
};

export default Index;
