import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PortfolioDetailsData } from "../types/wizard";

interface PortfolioDetailsProps {
  formData: PortfolioDetailsData;
  updateFormData: (data: Partial<PortfolioDetailsData>) => void;
}

// Mock data for existing portfolios
const existingPortfolios = [
  { id: "1", name: "Kyle's Portfolio", description: "My portfolio." },
  {
    id: "2",
    name: "Crazy Portfolio",
    description: "A crazy off-the-wall portfolio blend.",
  },
  {
    id: "3",
    name: "Boring Portfolio",
    description: "A boring, safe portfolio blend.",
  },
];

export default function PortfolioDetails({
  formData,
  updateFormData,
}: PortfolioDetailsProps) {
  const [PortfolioType, setPortfolioType] = useState<"new" | "existing">("new");

  const handleExistingPortfolioSelect = (portfolioId: string) => {
    const selectedPortfolio = existingPortfolios.find(
      (portfolio) => portfolio.id === portfolioId
    );
    if (selectedPortfolio) {
      updateFormData({
        name: selectedPortfolio.name,
        description: selectedPortfolio.description,
      });
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={PortfolioType}
        onValueChange={(value: "new" | "existing") => setPortfolioType(value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new-portfolio" />
          <Label htmlFor="new-portfolio">New Portfolio</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="existing-portfolio" />
          <Label htmlFor="existing-portfolio">Existing Portfolio</Label>
        </div>
      </RadioGroup>

      {PortfolioType === "new" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="Enter a name for your portfolio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Enter a description for your portfolio"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="existing-portfolio-select">
            Select Existing Portfolio
          </Label>
          <Select onValueChange={handleExistingPortfolioSelect}>
            <SelectTrigger id="existing-portfolio-select">
              <SelectValue placeholder="Select a portfolio" />
            </SelectTrigger>
            <SelectContent>
              {existingPortfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name} ({portfolio.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
