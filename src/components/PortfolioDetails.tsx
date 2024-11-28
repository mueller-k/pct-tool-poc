"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, TableIcon } from "lucide-react";
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
  const [isClipboardSupported, setIsClipboardSupported] = useState(false);
  const pasteTargetRef = useRef<HTMLDivElement>(null);

  // Check for Clipboard API support on component mount
  useEffect(() => {
    setIsClipboardSupported(
      typeof navigator !== "undefined" &&
        !!navigator.clipboard &&
        typeof navigator.clipboard.readText === "function"
    );
  }, []);

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

  const handlePaste = async (e?: React.ClipboardEvent) => {
    e?.preventDefault();
    setError(null);

    try {
      let text: string | undefined;

      if (e) {
        // Handle regular paste event
        text = e.clipboardData.getData("text");
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        // Handle mobile clipboard API
        const clipboardItems = await navigator.clipboard.readText();
        text = clipboardItems;
      }

      if (text) {
        const parsedData = parseExcelData(text);
        if (parsedData.length > 0 && parsedData[0].length > 0) {
          updateFormData({ tableData: parsedData });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Failed to access clipboard. Please try copying your data again."
      );
    }
  };

  const handleMobilePaste = async () => {
    try {
      await handlePaste();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to paste. Please try copying your data again.");
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
        <div className="relative">
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
                <div className="space-y-2">
                  <TableIcon className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragging
                      ? "Drop Excel data here"
                      : "Copy data from Excel and paste here"}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Mobile paste button - only show if clipboard is supported */}
          {isClipboardSupported && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2 md:hidden"
              onClick={handleMobilePaste}
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Paste
            </Button>
          )}
        </div>

        {/* Instructions for mobile users */}
        {isClipboardSupported && (
          <p className="text-sm text-muted-foreground md:hidden">
            Tap the paste button after copying your Excel data
          </p>
        )}
      </div>

      {formData.tableData && formData.tableData.length > 0 && (
        <div className="space-y-2">
          <Label>Pasted Data</Label>
          <div className="border rounded-lg overflow-auto">
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
