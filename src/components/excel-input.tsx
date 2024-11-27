import React, { useState, KeyboardEvent } from "react";
import { useExcelInput } from "../hooks/useExcelInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Clipboard } from "lucide-react";

export default function ExcelInput() {
  const { tableData, handlePaste, handleFileUpload, updateCell } =
    useExcelInput();
  const [isPasting, setIsPasting] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    cell: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCellEdit = (
    rowIndex: number,
    cellIndex: number,
    value: string
  ) => {
    updateCell(rowIndex, cellIndex, value);
    setEditingCell(null);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (e.key === "Enter") {
      handleCellEdit(rowIndex, cellIndex, editValue);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className={`flex-grow border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer transition-colors ${
            isPasting
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
          }`}
          onPaste={(e) => {
            handlePaste(e);
            setIsPasting(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsPasting(true)}
          onDragLeave={() => setIsPasting(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsPasting(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              const dummyEvent = {
                target: { files: [file] },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleFileUpload(dummyEvent);
            }
          }}
        >
          <div className="text-center">
            <Clipboard className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Paste data here</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="file"
            id="excel-upload"
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          <label htmlFor="excel-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
          </label>
        </div>
      </div>
      {tableData.length > 0 && (
        <div className="overflow-x-auto">
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
                    <TableCell key={cellIndex} className="p-0">
                      {editingCell?.row === rowIndex + 1 &&
                      editingCell?.cell === cellIndex ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, rowIndex + 1, cellIndex)
                          }
                          autoFocus
                          className="h-full w-full border-none focus:ring-0"
                        />
                      ) : (
                        <div
                          className="p-2 h-full w-full cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setEditingCell({
                              row: rowIndex + 1,
                              cell: cellIndex,
                            });
                            setEditValue(cell);
                          }}
                        >
                          {cell}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
