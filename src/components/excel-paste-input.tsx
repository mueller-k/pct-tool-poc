import React from "react";
import { usePasteExcel } from "../hooks/usePasteExcel";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ExcelPasteInput() {
  const { tableData, handlePaste } = usePasteExcel();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Textarea
        placeholder="Paste data here..."
        className="min-h-[100px]"
        onPaste={handlePaste}
      />
      {tableData.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {tableData[0].map((cell, index) => (
                <TableHead key={index}>{cell}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
