import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { BenchmarkSelectionData } from "../types/wizard";

interface BenchmarkSelectionProps {
  formData: BenchmarkSelectionData;
  updateFormData: (data: Partial<BenchmarkSelectionData>) => void;
}

export default function BenchmarkSelection({
  formData,
  updateFormData,
}: BenchmarkSelectionProps) {
  const benchmarks = [
    { id: "equity", name: "Equity", description: "80/20 Equity benchmark" },
    {
      id: "fixed income",
      name: "Fixed Income",
      description: "10/90 Fixed income benchmark",
    },
  ];

  return (
    <RadioGroup
      value={formData.benchmark}
      onValueChange={(value) => updateFormData({ benchmark: value })}
      className="space-y-4"
    >
      {benchmarks.map((benchmark) => (
        <div key={benchmark.id} className="flex items-center space-x-2">
          <RadioGroupItem value={benchmark.id} id={benchmark.id} />
          <Label htmlFor={benchmark.id} className="flex justify-between w-full">
            <span>{benchmark.name}</span>
            <span>{benchmark.description}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
