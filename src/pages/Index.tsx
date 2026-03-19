import { useMemo, useState } from "react";
import { AppSidebar, Screen } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { ProjectList } from "@/components/ProjectList";
import { InputProject } from "@/components/InputProject";
import { CostEstimation } from "@/components/CostEstimation";
import { ResourcePlanning } from "@/components/ResourcePlanning";
import { TimelineGantt } from "@/components/TimelineGantt";
import { AIChatBubble } from "@/components/AIChatBubble";
import {
  calculateConfidence,
  calculateCostRows,
  calculateResourcePlan,
  calculateTimeline,
  defaultProjectDetails,
  type ProjectDetails,
} from "@/lib/project-model";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const screenOrder: Screen[] = ["input", "cost", "resource", "timeline"];
  const [screen, setScreen] = useState<Screen>("input");
  const [highestUnlocked, setHighestUnlocked] = useState<Screen>("input");
  const [showProjectList, setShowProjectList] = useState(true);
  const [project, setProject] = useState<ProjectDetails>(defaultProjectDetails);
  const [contingencyPct, setContingencyPct] = useState(10);
  const [crewMultiplier, setCrewMultiplier] = useState(1);
  const [accelerated, setAccelerated] = useState(false);

  const costRows = useMemo(
    () => calculateCostRows(project, contingencyPct),
    [project, contingencyPct],
  );
  const totalCost = useMemo(
    () => costRows.reduce((sum, row) => sum + row.total, 0),
    [costRows],
  );
  const confidence = useMemo(
    () => calculateConfidence(project, contingencyPct),
    [project, contingencyPct],
  );
  const resourcePlan = useMemo(
    () => calculateResourcePlan(project, { crewMultiplier, accelerated }),
    [project, crewMultiplier, accelerated],
  );
  const timeline = useMemo(() => calculateTimeline(project), [project]);

  const openScreen = (next: Screen) => {
    const nextIndex = screenOrder.indexOf(next);
    const unlockedIndex = screenOrder.indexOf(highestUnlocked);
    if (nextIndex > unlockedIndex) {
      return;
    }

    if (next !== "input") {
      setShowProjectList(false);
    }
    setScreen(next);
  };

  const moveForward = (next: Screen) => {
    const nextIndex = screenOrder.indexOf(next);
    const unlockedIndex = screenOrder.indexOf(highestUnlocked);

    if (nextIndex > unlockedIndex) {
      setHighestUnlocked(next);
    }
    if (next !== "input") {
      setShowProjectList(false);
    }
    setScreen(next);
  };

  const loadDemoProject = (id: string) => {
    const demo: Record<string, Partial<ProjectDetails>> = {
      "1": {
        name: "Greenfield Residential Complex",
        type: "residential",
        location: "Mumbai, India",
        areaSqFt: 12000,
        material: "concrete",
        budget: 25000000,
        startDate: new Date(2025, 3, 1),
      },
      "2": {
        name: "Horizon Commercial Tower",
        type: "commercial",
        location: "Bangalore, India",
        areaSqFt: 45000,
        material: "steel",
        budget: 80000000,
        startDate: new Date(2025, 5, 15),
      },
      "3": {
        name: "Riverside Infrastructure Bridge",
        type: "infrastructure",
        location: "Delhi, India",
        areaSqFt: 8000,
        material: "mixed",
        budget: 50000000,
        startDate: new Date(2025, 2, 10),
      },
    };

    const details = demo[id];
    if (!details) {
      return;
    }

    setProject((prev) => ({ ...prev, ...details }));
    setHighestUnlocked("timeline");
    setShowProjectList(false);
    setScreen("cost");
  };

  const saveDraft = () => {
    localStorage.setItem(
      "buildsmart-draft",
      JSON.stringify({
        project: { ...project, startDate: project.startDate.toISOString() },
        contingencyPct,
        crewMultiplier,
        accelerated,
        highestUnlocked,
        screen,
      }),
    );
    toast.success("Draft saved", {
      description: "Project state was saved in this browser.",
    });
  };

  const loadDraft = () => {
    const raw = localStorage.getItem("buildsmart-draft");
    if (!raw) {
      toast.error("No draft found", {
        description: "Save once to create a local draft.",
      });
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setProject({
        ...parsed.project,
        startDate: new Date(parsed.project.startDate),
      });
      setContingencyPct(parsed.contingencyPct ?? 10);
      setCrewMultiplier(parsed.crewMultiplier ?? 1);
      setAccelerated(Boolean(parsed.accelerated));
      setHighestUnlocked(parsed.highestUnlocked ?? "input");
      setScreen(parsed.screen ?? "input");
      setShowProjectList(false);
      toast.success("Draft loaded");
    } catch {
      toast.error("Draft is invalid", {
        description: "Could not parse saved project state.",
      });
    }
  };

  const resetWorkflow = () => {
    setProject(defaultProjectDetails);
    setContingencyPct(10);
    setCrewMultiplier(1);
    setAccelerated(false);
    setHighestUnlocked("input");
    setShowProjectList(false);
    setScreen("input");
    toast.success("Workflow reset", {
      description: "You can start a fresh planning cycle.",
    });
  };

  const renderScreen = () => {
    switch (screen) {
      case "input":
        if (showProjectList) {
          return (
            <ProjectList
              onSelectProject={loadDemoProject}
              onNewProject={() => {
                setShowProjectList(false);
              }}
            />
          );
        }

        return (
          <InputProject
            initialValue={project}
            onSubmit={(details) => {
              setProject(details);
              moveForward("cost");
            }}
          />
        );
      case "cost":
        return (
          <CostEstimation
            project={project}
            rows={costRows}
            contingencyPct={contingencyPct}
            confidence={confidence}
            onChangeContingency={setContingencyPct}
            onNext={() => moveForward("resource")}
          />
        );
      case "resource":
        return (
          <ResourcePlanning
            project={project}
            plan={resourcePlan}
            crewMultiplier={crewMultiplier}
            accelerated={accelerated}
            onChangeCrewMultiplier={setCrewMultiplier}
            onChangeAccelerated={setAccelerated}
            onNext={() => moveForward("timeline")}
          />
        );
      case "timeline":
        return <TimelineGantt project={project} phases={timeline.phases} totalWeeks={timeline.totalWeeks} />;
    }

    return null;
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar
        active={screen}
        highestUnlocked={highestUnlocked}
        onNavigate={openScreen}
        onNewProject={resetWorkflow}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          projectName={project.name}
          projectLocation={project.location}
          totalCost={totalCost}
          onSaveDraft={saveDraft}
          onLoadDraft={loadDraft}
          onReset={resetWorkflow}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderScreen()}
        </main>
      </div>
      <AIChatBubble
        project={project}
        screen={screen}
        totalCost={totalCost}
        onApplyBudgetChange={(deltaPct) =>
          setProject((prev) => ({
            ...prev,
            budget: Math.max(100000, Math.round(prev.budget * (1 + deltaPct / 100))),
          }))
        }
      />
    </div>
  );
};

export default Index;
