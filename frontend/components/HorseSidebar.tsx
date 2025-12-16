"use client";

// サイドバーのコンポーネント
import React from "react";
import { Box, List, ListItemButton, ListItemText, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Horse } from "@/lib/types";

export default function HorseSidebar(props: {
  width: number;
  horses: Horse[];
  selectedHorseId: number | null;
  onSelectHorse: (id: number) => void;
  onAddNote: () => void;
  onAddHorse: () => void;
}) {
  const { width, horses, selectedHorseId, onSelectHorse, onAddNote } = props;
  const isAddDisabled = !selectedHorseId;

  return (
    <Box
      sx={{
        width,
        borderRight: 1,
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 新規馬名追加ボタン */}
      <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
      <Tooltip title="新しい馬を追加">
      <IconButton
        color="primary"
        onClick={props.onAddHorse}
        sx={{ bgcolor: "primary.main", color: "primary.contrastText", boxShadow: 2 }}
      >
        <AddIcon />
      </IconButton>
      </Tooltip>
      </Box>

      {/* 新規Note追加ボタン */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <Tooltip title={isAddDisabled ? "馬を選択すると新規メモを追加できます" : "新しいメモを追加"}>
          <span>
            <IconButton
              color="primary"
              onClick={onAddNote}
              disabled={isAddDisabled}
              sx={{
                bgcolor: isAddDisabled ? "action.disabledBackground" : "primary.main",
                color: isAddDisabled ? "text.disabled" : "primary.contrastText",
                "&:hover": isAddDisabled ? undefined : { bgcolor: "primary.dark" },
                boxShadow: 2,
              }}
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Horse一覧 */}
      <Box sx={{ pt: 10, height: "100%", overflowY: "auto" }}>
        <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
          Horse 一覧
        </Typography>
        <List dense>
          {horses.map((horse) => (
            <ListItemButton
              key={horse.id}
              selected={horse.id === selectedHorseId}
              onClick={() => onSelectHorse(horse.id)}
            >
              <ListItemText primary={horse.name} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}
