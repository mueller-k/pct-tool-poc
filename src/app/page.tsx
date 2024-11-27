"use client";

import ExcelInput from "../components/excel-input";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Portfolio Builder</h1>
      <ExcelInput />
    </div>
  );
}
