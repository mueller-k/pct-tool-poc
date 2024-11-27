import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export function useExcelInput() {
  const [tableData, setTableData] = useState<string[][]>([]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const rows = pastedData.split('\n').map(row => row.split('\t'));
    setTableData(rows);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        setTableData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const updateCell = useCallback((rowIndex: number, cellIndex: number, value: string) => {
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][cellIndex] = value;
      return newData;
    });
  }, []);

  return { tableData, handlePaste, handleFileUpload, updateCell };
}

