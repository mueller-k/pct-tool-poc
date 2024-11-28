"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PortfolioDetails from "./PortfolioDetails";
import BenchmarkSelection from "./BenchmarkSelection";
import ScenarioSelection from "./ScenarioSelection";
import Summary from "./Summary";
import type { Step, WizardFormData } from "../types/wizard";

export default function Wizard() {
  const [step, setStep] = useState<Step>("portfolioDetails");
  const [formData, setFormData] = useState<WizardFormData>({
    name: "",
    description: "",
    benchmark: "",
    scenario: "",
  });

  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    switch (step) {
      case "portfolioDetails":
        setStep("benchmarkSelection");
        break;
      case "benchmarkSelection":
        setStep("scenarioSelection");
        break;
      case "scenarioSelection":
        setStep("summary");
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    switch (step) {
      case "benchmarkSelection":
        setStep("portfolioDetails");
        break;
      case "scenarioSelection":
        setStep("benchmarkSelection");
        break;
      case "summary":
        setStep("scenarioSelection");
        break;
      default:
        break;
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case "portfolioDetails":
        return !!formData.name && !!formData.description;
      case "benchmarkSelection":
        return !!formData.benchmark;
      case "scenarioSelection":
        return true; // TODO: Change this so Scenario is not optional
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>PCT POC</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between">
            {[
              "Portfolio Details",
              "Benchmark Selection",
              "Scenario Selection",
              "Summary",
            ].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index ===
                    [
                      "portfolioDetails",
                      "benchmarkSelection",
                      "scenarioSelection",
                      "summary",
                    ].indexOf(step)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm hidden sm:inline">
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        </div>
        {step === "portfolioDetails" && (
          <PortfolioDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {step === "benchmarkSelection" && (
          <BenchmarkSelection
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {step === "scenarioSelection" && (
          <ScenarioSelection
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {step === "summary" && <Summary formData={formData} />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStep} disabled={step === "portfolioDetails"}>
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={step === "summary" || !isStepComplete()}
        >
          {step === "summary" ? "Get Results" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
