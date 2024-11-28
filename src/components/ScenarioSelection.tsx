import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ScenarioSelectionData } from "../types/wizard";

interface ScenarioSelectionProps {
  formData: ScenarioSelectionData;
  updateFormData: (data: Partial<ScenarioSelectionData>) => void;
}

export default function ScenarioSelection({
  formData,
  updateFormData,
}: ScenarioSelectionProps) {
  const scenarios = [
    {
      id: "interestRise",
      name: "Rise in Interest Rates",
      description: "Interest rates up by 2 basis points",
    },
    {
      id: "inflation",
      name: "Inflation",
      description: "Inflation increase of 2%",
    },
    {
      id: "marketCollapse",
      name: "Market Collapse",
      description: "Uh-oh",
    },
  ];

  return (
    <div className="space-y-4">
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="flex items-center space-x-2">
          <Checkbox
            id={scenario.id}
            checked={formData.scenario === scenario.id}
            onCheckedChange={(checked) => {
              if (checked) {
                updateFormData({ scenario: scenario.id });
              } else {
                updateFormData({ scenario: "" });
              }
            }}
          />
          <Label htmlFor={scenario.id} className="flex justify-between w-full">
            <span>{scenario.name}</span>
            <span>{scenario.description}</span>
          </Label>
        </div>
      ))}
    </div>
  );
}
