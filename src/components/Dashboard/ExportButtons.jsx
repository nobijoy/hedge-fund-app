import React from "react";
import { Button, Stack } from "@mui/material";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import DownloadIcon from '@mui/icons-material/Download';

export default function ExportButtons({ data }) {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contributions");
    XLSX.writeFile(wb, "contributions.xlsx");
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={exportToExcel}
        sx={{ textTransform: "none", minWidth: 150 }}
      >
        Export to Excel
      </Button>

      <CSVLink
        data={data}
        filename="contributions.csv"
        style={{ textDecoration: "none", width: "100%" }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          sx={{ textTransform: "none", minWidth: 150, width: "100%" }}
        >
          Export to CSV
        </Button>
      </CSVLink>
    </Stack>
  );
}
