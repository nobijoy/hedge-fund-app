import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { db } from "../../firebaseConfig";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MonthlyManagement() {
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user: "",
    amount: "",
    month: "",
    year: new Date().getFullYear().toString(),
  });

  const fetchEntries = async () => {
    const snap = await getDocs(collection(db, "contributions"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
  };

  useEffect(() => {
    fetchEntries();
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    const { user, amount, month, year } = form;
    if (!user || !amount || !month || !year) return;

    await addDoc(collection(db, "contributions"), {
      user,
      amount: Number(amount),
      month,
      year,
    });
    setOpen(false);
    setForm({ user: "", amount: "", month: "", year: new Date().getFullYear().toString() });
    fetchEntries();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "contributions", id));
    fetchEntries();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Monthly Data Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ backgroundColor: "#722f37", "&:hover": { backgroundColor: "#5e232a" } }}
        >
          Add Entry
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#722f37" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>User</TableCell>
              <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
              <TableCell sx={{ color: "#fff" }}>Month</TableCell>
              <TableCell sx={{ color: "#fff" }}>Year</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.user}</TableCell>
                <TableCell>${entry.amount}</TableCell>
                <TableCell>{entry.month}</TableCell>
                <TableCell>{entry.year}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(entry.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Entry Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Monthly Entry</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="User"
              select
              value={form.user}
              onChange={(e) => setForm({ ...form, user: e.target.value })}
              fullWidth
              required
            >
              {users.length === 0 ? (
                <MenuItem disabled>No users found</MenuItem>
              ) : (
                users.map((u) => (
                  <MenuItem key={u.id} value={u.name}>
                    {u.name}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Month"
              select
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              fullWidth
              required
            >
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Year"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{ backgroundColor: "#722f37", "&:hover": { backgroundColor: "#5e232a" } }}
          >
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
