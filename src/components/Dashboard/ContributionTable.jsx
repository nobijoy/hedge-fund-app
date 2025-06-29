import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule, CsvExportModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

export default function ContributionTable({ rowData }) {
  const columnDefs = [
    { field: "user", headerName: "User", filter: true, flex: 1, headerClass: "header-style" },
    { field: "month", headerName: "Month", filter: true, flex: 1, headerClass: "header-style" },
    {
      field: "amount",
      headerName: "Amount",
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      flex: 1,
      headerClass: "header-style",
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{
        width: "100%",
        height: 450,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgb(0 0 0 / 0.1)",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={15}
        defaultColDef={defaultColDef}
        suppressRowHoverHighlight={false}
      />
      <style>{`
        .header-style {
          font-weight: 700 !important;
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}
