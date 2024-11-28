"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PortfolioDetailsData } from "../types/wizard";

interface PortfolioDetailsProps {
  formData: PortfolioDetailsData & { tableData?: string[][] };
  updateFormData: (data: Partial<PortfolioDetailsData>) => void;
}

export default function PortfolioDetails({
  formData,
  updateFormData,
}: PortfolioDetailsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pasteTargetRef = useRef<HTMLDivElement>(null);

  const parseExcelData = (text: string): string[][] => {
    // First, try to split by tabs (Excel default)
    const rows = text.split(/[\r\n]+/).filter((row) => row.trim());
    let cells = rows.map((row) => row.split("\t"));

    // If we don't have multiple columns, try comma splitting (CSV)
    if (cells[0].length <= 1) {
      cells = rows.map((row) => row.split(",").map((cell) => cell.trim()));
    }

    return cells;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    try {
      const text = e.dataTransfer.getData("text");
      if (text) {
        const parsedData = parseExcelData(text);
        if (parsedData.length > 0 && parsedData[0].length > 0) {
          updateFormData({ tableData: parsedData });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Failed to parse the dropped data. Please make sure it's valid Excel data."
      );
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const text = e.clipboardData.getData("text");
      if (text) {
        const parsedData = parseExcelData(text);
        if (parsedData.length > 0 && parsedData[0].length > 0) {
          updateFormData({ tableData: parsedData });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Failed to parse the pasted data. Please make sure it's valid Excel data."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="portfolioName">Portfolio Name</Label>
        <Input
          id="portfolioName"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="Enter your portfolio name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioDescription">Portfolio Description</Label>
        <Textarea
          id="portfolioDescription"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe your portfolio"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Paste Excel Data</Label>
        <Card
          ref={pasteTargetRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
          role="textbox"
          aria-label="Paste excel data area"
          className={`
            h-32 
            flex 
            items-center 
            justify-center 
            border-2 
            border-dashed 
            rounded-lg 
            cursor-pointer
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25"
            }
            ${error ? "border-destructive" : ""}
          `}
        >
          <div className="text-center p-4">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isDragging
                  ? "Drop Excel data here"
                  : "Copy data from Excel and paste here, or drag and drop"}
              </p>
            )}
          </div>
        </Card>
      </div>

      {formData.tableData && formData.tableData.length > 0 && (
        <div className="space-y-2">
          <Label>Pasted Data</Label>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {formData.tableData[0].map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.tableData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
