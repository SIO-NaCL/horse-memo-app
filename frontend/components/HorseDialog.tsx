"use client";

import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HorseDialog(props: {
  open: boolean;
  name: string;
  onChangeName: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const { open, name, onChangeName, onClose, onSubmit } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        新規Horse追加
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="馬名"
            fullWidth
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            autoFocus
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!name.trim()}>
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
}
