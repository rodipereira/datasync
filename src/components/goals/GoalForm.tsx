import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Goal, KPI } from "@/pages/Goals";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, X, Target } from "lucide-react";

interface GoalFormProps {
  initialData?: Goal;
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const GoalForm = ({ initialData, onSubmit }: GoalFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || ("revenue" as Goal['category']),
    priority: initialData?.priority || ("medium" as Goal['priority']),
    status: initialData?.status || ("planning" as Goal['status']),
    targetValue: initialData?.targetValue || 0,
    currentValue: initialData?.currentValue || 0,
    unit: initialData?.unit || "",
    startDate: initialData?.startDate || new Date(),
    endDate: initialData?.endDate || new Date(),
    assignedTo: initialData?.assignedTo || "",
  });

  const [kpis, setKpis] = useState<KPI[]>(initialData?.kpis || []);
  const [newKpi, setNewKpi] = useState({
    name: "",
    description: "",
    targetValue: 0,
    unit: ""
  });
  const [showKpiForm, setShowKpiForm] = useState(false);

  const handleInputChange = (field: string, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddKpi = () => {
    if (newKpi.name && newKpi.unit && newKpi.targetValue > 0) {
      const kpi: KPI = {
        id: Date.now().toString(),
        name: newKpi.name,
        description: newKpi.description,
        targetValue: newKpi.targetValue,
        currentValue: 0,
        unit: newKpi.unit,
        lastUpdated: new Date()
      };
      setKpis([...kpis, kpi]);
      setNewKpi({
        name: "",
        description: "",
        targetValue: 0,
        unit: ""
      });
      setShowKpiForm(false);
    }
  };

  const handleRemoveKpi = (kpiId: string) => {
    setKpis(kpis.filter(kpi => kpi.id !== kpiId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.unit || formData.targetValue <= 0) {
      return;
    }

    const goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      kpis
    };

    onSubmit(goal);
  };

  const categoryOptions = [
    { value: 'revenue', label: 'Receita' },
    { value: 'growth', label: 'Crescimento' },
    { value: 'efficiency', label: 'Eficiência' },
    { value: 'quality', label: 'Qualidade' },
    { value: 'team', label: 'Equipe' },
    { value: 'customer', label: 'Cliente' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planejamento' },
    { value: 'in-progress', label: 'Em Progresso' },
    { value: 'on-track', label: 'No Prazo' },
    { value: 'at-risk', label: 'Em Risco' },
    { value: 'completed', label: 'Concluída' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="title">Título da Meta *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Aumentar receita mensal em 25%"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva o objetivo detalhadamente..."
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value: Goal['category']) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Prioridade *</Label>
            <Select value={formData.priority} onValueChange={(value: Goal['priority']) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Goal['status']) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Target Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="targetValue">Valor Meta *</Label>
          <Input
            id="targetValue"
            type="number"
            value={formData.targetValue}
            onChange={(e) => handleInputChange('targetValue', Number(e.target.value))}
            placeholder="0"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="currentValue">Valor Atual</Label>
          <Input
            id="currentValue"
            type="number"
            value={formData.currentValue}
            onChange={(e) => handleInputChange('currentValue', Number(e.target.value))}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="unit">Unidade *</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
            placeholder="Ex: R$, %, unidades"
            required
          />
        </div>
      </div>

      {/* Dates and Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Data de Início *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP", { locale: ptBR })
                ) : (
                  "Selecione a data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && handleInputChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Data de Conclusão *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP", { locale: ptBR })
                ) : (
                  "Selecione a data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => date && handleInputChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="assignedTo">Responsável</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            placeholder="Equipe ou pessoa responsável"
          />
        </div>
      </div>

      {/* KPIs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2" />
              KPIs ({kpis.length})
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowKpiForm(!showKpiForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar KPI
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add KPI Form */}
          {showKpiForm && (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="kpiName">Nome do KPI</Label>
                  <Input
                    id="kpiName"
                    value={newKpi.name}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Número de vendas"
                  />
                </div>
                <div>
                  <Label htmlFor="kpiUnit">Unidade</Label>
                  <Input
                    id="kpiUnit"
                    value={newKpi.unit}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="Ex: vendas, %, R$"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="kpiDescription">Descrição</Label>
                <Input
                  id="kpiDescription"
                  value={newKpi.description}
                  onChange={(e) => setNewKpi(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição opcional do KPI"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="kpiTarget">Valor Meta</Label>
                  <Input
                    id="kpiTarget"
                    type="number"
                    value={newKpi.targetValue}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="button" onClick={handleAddKpi} size="sm">
                    Adicionar
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowKpiForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* KPI List */}
          {kpis.length > 0 ? (
            <div className="space-y-2">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{kpi.name}</span>
                      <Badge variant="secondary">
                        {kpi.targetValue} {kpi.unit}
                      </Badge>
                    </div>
                    {kpi.description && (
                      <p className="text-sm text-muted-foreground mt-1">{kpi.description}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveKpi(kpi.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum KPI adicionado ainda</p>
              <p className="text-sm">KPIs ajudam a acompanhar o progresso da meta</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="submit">
          {initialData ? 'Atualizar Meta' : 'Criar Meta'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;