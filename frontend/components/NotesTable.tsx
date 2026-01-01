"use client";

import React from "react";
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton,Tooltip } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Note, SortKey, SortOrder } from "@/lib/types";

export default function NotesTable(props: {
  horseName: string;
  notes: Note[];
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
  onDeleteNote: (noteId: number, noteTitle: string) => void;
  onRowClick: (noteId: number) => void;
}) {
  const { horseName, notes, sortKey, sortOrder, onSortChange } = props;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {horseName} のメモ一覧
      </Typography>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>タイトル</TableCell>
              <TableCell>内容</TableCell>
              <TableCell>URL</TableCell>
              {/* <TableCell align="right">操作</TableCell> */}

              <TableCell>
                <SortHeader
                  label="created_at"
                  active={sortKey === "created_at"}
                  order={sortOrder}
                  onAsc={() => onSortChange("created_at", "asc")}
                  onDesc={() => onSortChange("created_at", "desc")}
                />
              </TableCell>

              <TableCell>
                <SortHeader
                  label="updated_at"
                  active={sortKey === "updated_at"}
                  order={sortOrder}
                  onAsc={() => onSortChange("updated_at", "asc")}
                  onDesc={() => onSortChange("updated_at", "desc")}
                />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id} 
              hover
              onClick={() => props.onRowClick(note.id)}
              sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography noWrap>{note.title}</Typography>
                </TableCell>

                <TableCell sx={{ maxWidth: 320 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {note.body}
                  </Typography>
                </TableCell>

                <TableCell sx={{ maxWidth: 200 }}>
                  {note.url ? (
                    <a href={note.url} target="_blank" rel="noopener noreferrer">
                      リンク
                    </a>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      なし
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Typography variant="caption">{new Date(note.created_at).toLocaleString()}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="caption">{new Date(note.updated_at).toLocaleString()}</Typography>
                </TableCell>
                
                {/* Delete Button */}
                <TableCell align="right">
                  <Tooltip title="削除">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDeleteNote(note.id, note.title);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                
              </TableRow>
            ))}

            {notes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    この馬のメモはまだありません。
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

// ヘッダーのソートボタンコンポーネント
function SortHeader(props: {
  label: string;
  active: boolean;
  order: SortOrder;
  onAsc: () => void;
  onDesc: () => void;
}) {
  const { label, active, order, onAsc, onDesc } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {label}
      {/*  Sort Button ▲▼*/}
      <IconButton size="small" onClick={onAsc}>
        <ArrowDropUpIcon fontSize="small" color={active && order === "asc" ? "primary" : "inherit"} />
      </IconButton>
      <IconButton size="small" onClick={onDesc}>
        <ArrowDropDownIcon fontSize="small" color={active && order === "desc" ? "primary" : "inherit"} />
      </IconButton>
    </Box>
  );
}
