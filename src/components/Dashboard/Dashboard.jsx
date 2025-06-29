import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Button,
  createTheme,
  ThemeProvider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  useTable,
  useSortBy,
  usePagination,
} from "react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Wine Red Theme
const wineRedTheme = createTheme({
  palette: {
    primary: {
      main: "#722f37",
    },
  },
});

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userFilter, setUserFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Fetch data from Firestore
  useEffect(() => {
    async function fetchContributions() {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "contributions"));
      setData(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    }
    fetchContributions();
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const [month, year] = item.month?.split(" ") || [];
      return (
        (!userFilter || item.user === userFilter) &&
        (!monthFilter || month === monthFilter) &&
        (!yearFilter || year === yearFilter)
      );
    });
  }, [data, userFilter, monthFilter, yearFilter]);

  // Dropdown options
  const users = [...new Set(data.map((item) => item.user))];
  const months = [...new Set(data.map((item) => item.month?.split(" ")[0]))];
  const years = [...new Set(data.map((item) => item.month?.split(" ")[1]))];

  // Table Columns
  const columns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user",
      },
      {
        Header: "Month",
        accessor: "month",
      },
      {
        Header: "Amount",
        accessor: "amount",
        isNumeric: true,
        Cell: ({ value }) =>
          value != null ? `$${Number(value).toFixed(2)}` : "-",
      },
    ],
    []
  );

  // React Table setup
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contributions");
    XLSX.writeFile(wb, "contributions.xlsx");
  };

  return (
    <ThemeProvider theme={wineRedTheme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          Hedge Fund Tracker Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Filter and export contributions data by user, month, and year.
        </Typography>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ my: 3 }}
        >
          <FormControl fullWidth>
            <InputLabel>User</InputLabel>
            <Select
              value={userFilter}
              label="User"
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {users.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={monthFilter}
              label="Month"
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={yearFilter}
              label="Year"
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Table Section */}
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table {...getTableProps()} sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: "primary.main" }}>
                    {headerGroups.map((headerGroup) => (
                      <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <TableCell
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              userSelect: "none",
                              textAlign: column.isNumeric ? "right" : "left",
                            }}
                          >
                            {column.render("Header")}
                            <TableSortLabel
                              active={column.isSorted}
                              direction={column.isSortedDesc ? "desc" : "asc"}
                              sx={{ color: "white" }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>

                  <TableBody {...getTableBodyProps()}>
                    {page.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          No matching data
                        </TableCell>
                      </TableRow>
                    ) : (
                      page.map((row) => {
                        prepareRow(row);
                        return (
                          <TableRow
                            {...row.getRowProps()}
                            sx={{ "&:hover": { bgcolor: "action.hover" } }}
                          >
                            {row.cells.map((cell) => (
                              <TableCell
                                {...cell.getCellProps()}
                                sx={{
                                  textAlign: cell.column.isNumeric
                                    ? "right"
                                    : "left",
                                  fontWeight:
                                    cell.column.id === "amount" ? "600" : "400",
                                  color:
                                    cell.column.id === "amount" &&
                                    cell.value >= 0
                                      ? "success.main"
                                      : cell.column.id === "amount"
                                      ? "error.main"
                                      : "text.primary",
                                }}
                              >
                                {cell.render("Cell")}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>

                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={columns.length}
                        count={filteredData.length}
                        rowsPerPage={pageSize}
                        page={pageIndex}
                        onPageChange={(_, newPage) => gotoPage(newPage)}
                        onRowsPerPageChange={(e) =>
                          setPageSize(Number(e.target.value))
                        }
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
                mt={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={exportToExcel}
                  sx={{ minWidth: 150, width: "100%" }}
                >
                  Export to Excel
                </Button>
                <CSVLink
                  data={filteredData}
                  filename="contributions.csv"
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ minWidth: 150, width: "100%" }}
                  >
                    Export to CSV
                  </Button>
                </CSVLink>
              </Stack>
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
