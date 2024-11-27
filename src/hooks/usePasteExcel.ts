import { useState, useCallback } from 'react';

export function usePasteExcel() {
  const [tableData, setTableData] = useState<string[][]>([]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const rows = pastedData.split('\n').map(row => row.split('\t'));
    setTableData(rows);
  }, []);

  return { tableData, handlePaste };
}

