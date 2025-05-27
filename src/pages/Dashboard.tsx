
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import NavBar from "@/components/NavBar";
import DashboardMetrics from "@/components/DashboardMetrics";
import FileHistory from "@/components/FileHistory";
import SmartDashboard from "@/components/dashboard/SmartDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalysisSection from "@/components/dashboard/AnalysisSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import EmployeeManagementSection from "@/components/dashboard/EmployeeManagementSection";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { MetricsSync } from "@/components/dashboard/MetricsSync";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dashboardMode, setDashboardMode] = useState<"classic" | "smart">("classic");

  const handleDetailedAnalysis = () => {
    navigate("/detailed-analysis");
  };

  const handleUpload = () => {
    navigate("/upload");
  };
  
  const handleAIAssistant = () => {
    navigate("/ai-assistant");
  };

  return (
    <div className="min-h-screen bg-background">
      <MetricsSync />
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          dashboardMode={dashboardMode}
          onModeChange={setDashboardMode}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onUpload={handleUpload}
          onAIAssistant={handleAIAssistant}
          onDetailedAnalysis={handleDetailedAnalysis}
        />

        <div className="space-y-8">
          <AnalysisSection />
          
          {/* Dashboard Inteligente ou Clássico */}
          {dashboardMode === "smart" ? (
            <SmartDashboard dateRange={dateRange} />
          ) : (
            <DashboardMetrics dateRange={dateRange} />
          )}
          
          <ChartsSection />
          
          <EmployeeManagementSection />
          
          {/* Histórico de Arquivos */}
          <ChartContainer
            title="Histórico de Arquivos"
            description="Arquivos enviados e suas análises"
          >
            <FileHistory />
          </ChartContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
