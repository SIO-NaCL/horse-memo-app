"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog(props: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDanger?: boolean;
}) {
  const {
    open,
    title,
    message,
    confirmText = "OK",
    cancelText = "キャンセル",
    onCancel,
    onConfirm,
    isDanger = false,
  } = props;

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button variant="contained" color={isDanger ? "error" : "primary"} onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
