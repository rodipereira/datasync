
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Monitor, Sun, Moon, Sparkles } from "lucide-react";

interface ThemeCustomizerProps {
  onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [customColors, setCustomColors] = useState({
    primary: "#8b5cf6",
    secondary: "#1e293b",
    accent: "#06b6d4"
  });
  const [animations, setAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const themes = [
    { id: "default", name: "Roxo Moderno", primary: "#8b5cf6", secondary: "#1e293b" },
    { id: "ocean", name: "Oceano", primary: "#0891b2", secondary: "#164e63" },
    { id: "forest", name: "Floresta", primary: "#059669", secondary: "#064e3b" },
    { id: "sunset", name: "Pôr do Sol", primary: "#ea580c", secondary: "#431407" },
    { id: "midnight", name: "Meia-noite", primary: "#6366f1", secondary: "#0f172a" },
    { id: "rose", name: "Rosa", primary: "#e11d48", secondary: "#4c1d95" }
  ];

  const applyTheme = (theme: any) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    
    localStorage.setItem('selectedTheme', theme.id);
    setSelectedTheme(theme.id);
  };

  const toggleAnimations = (enabled: boolean) => {
    setAnimations(enabled);
    const root = document.documentElement;
    if (!enabled) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }
    localStorage.setItem('animationsEnabled', enabled.toString());
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personalização de Tema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="themes">Temas</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTheme === theme.id ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => applyTheme(theme)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{theme.name}</span>
                    {selectedTheme === theme.id && <Badge>Ativo</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Cor Primária</Label>
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                  className="w-full h-10 rounded border"
                />
              </div>
              <div>
                <Label>Cor Secundária</Label>
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                  className="w-full h-10 rounded border"
                />
              </div>
              <div>
                <Label>Cor de Destaque</Label>
                <input
                  type="color"
                  value={customColors.accent}
                  onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                  className="w-full h-10 rounded border"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Modo Compacto</Label>
                <p className="text-sm text-gray-500">Reduz espaçamentos para mais conteúdo</p>
              </div>
              <Switch 
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Densidade do Dashboard</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Animações</Label>
                <p className="text-sm text-gray-500">Ativa transições e efeitos visuais</p>
              </div>
              <Switch 
                checked={animations}
                onCheckedChange={toggleAnimations}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Modo de Alto Contraste</Label>
                <p className="text-sm text-gray-500">Melhora acessibilidade</p>
              </div>
              <Switch />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>
            Aplicar Tema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;
