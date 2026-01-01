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

export default function NoteDialog(props: {
  open: boolean;
  title: string;
  body: string;
  url: string;
  dialogTitle: string;
  submitText: string;
  onChangeTitle: (v: string) => void;
  onChangeBody: (v: string) => void;
  onChangeUrl: (v: string) => void;
  onClose: () => void;
  onAfterClose?: () => void; // ←追加
  onSubmit: () => void;
  onClear: () => void;
  
}) {
  const {
    open,
    title,
    body,
    url,
    dialogTitle,
    submitText,
    onChangeTitle,
    onChangeBody,
    onChangeUrl,
    onClose,
    onAfterClose,
    onSubmit,
    onClear,
  } = props;

  return (
    <Dialog open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="sm"
            slotProps={{
            transition: {onExited: () => {onAfterClose?.();},}
            ,}}
            >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {dialogTitle}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="タイトル" fullWidth value={title} onChange={(e) => onChangeTitle(e.target.value)} />
          <TextField
            label="本文"
            fullWidth
            multiline
            minRows={3}
            value={body}
            onChange={(e) => onChangeBody(e.target.value)}
          />
          <TextField label="URL" fullWidth value={url} onChange={(e) => onChangeUrl(e.target.value)} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClear}>取り消し</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!title.trim()}>{submitText}</Button>
      </DialogActions>
    </Dialog>
  );
}
