import type { WizardFormData } from "../types/wizard";

interface SummaryProps {
  formData: WizardFormData;
}

export default function Summary({ formData }: SummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Summary</h3>
      <div className="space-y-2">
        <p>
          <strong>Portfolio Name:</strong> {formData.name}
        </p>
        <p>
          <strong>Portfolio Description:</strong> {formData.description}
        </p>
        <p>
          <strong>Selected Benchmark:</strong> {formData.benchmark}
        </p>
        <p>
          <strong>Selected Scenario:</strong> {formData.scenario || "None"}
        </p>
      </div>
    </div>
  );
}
