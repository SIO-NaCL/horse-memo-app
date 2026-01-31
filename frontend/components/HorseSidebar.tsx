"use client";

// サイドバーのコンポーネント
import React from "react";
import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemText,
  Stack, 
  Typography, 
  IconButton, 
  Tooltip,
  Icon
} from "@mui/material";
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

  // ●ボタンの共通スタイル定義
  const xs = 24;
  const sm = 44;
  const md = 48;
  const roundBtnSxMain = {
  width: { xs: xs, sm: sm, md: md },
  height: { xs: xs, sm: sm, md: md  },
  borderRadius: "50%",
  p: 0,
  bgcolor:  "primary.main",
  color:  "primary.contrastText",
  "&:hover": { bgcolor: "primary.dark" },
  boxShadow: 2,
  } as const;

  const roundBtnSxMemo = {
  width: { xs: xs, sm: sm, md: md  },
  height: { xs: xs, sm: sm, md: md  },
  borderRadius: "50%",
  p: 0,
  bgcolor: isAddDisabled ? "action.disabledBackground" : "primary.main",
  color: isAddDisabled ? "text.disabled" : "primary.contrastText",
  "&:hover": isAddDisabled ? undefined : { bgcolor: "primary.dark" },
  boxShadow: 2,
  } as const;

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
      {/*上部ボタン群 */}
      <Stack direction="row" spacing={1} >
      {/*homeボタン*/ }
        <IconButton
          color="primary"
          href="/" 
          sx={roundBtnSxMain}
        >
        <Icon baseClassName="material-symbols-outlined">home</Icon>
        </IconButton>

      {/* 新規馬名追加ボタン */}
        <Tooltip title="新しい馬を追加">
          <IconButton
            color="primary"
            onClick={props.onAddHorse}
            sx={roundBtnSxMain}
          >
            {/* 背面：半透明の chess_knight（Material Symbols） */}
            <Icon
              baseClassName="material-symbols-outlined"
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)", // ★ これで常に真ん中
                opacity: 0.4,
                fontSize: "clamp(26px, 2.6vw, 36px)",
                fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                pointerEvents: "none", // ← アイコンが邪魔してクリックできないのを防ぐ
                lineHeight: 1, // 上下ズレ防止
              }}
            >
              chess_knight
            </Icon>

            {/* 前面：通常の AddIcon */}
            <AddIcon sx={{ position: "relative" }} />
          </IconButton>
        </Tooltip>
      

      {/* 新規Note追加ボタン */}
        <Tooltip title={isAddDisabled ? "馬を選択すると新規メモを追加できます" : "新しいメモを追加"}>
            <IconButton
              color="primary"
              onClick={onAddNote}
              disabled={isAddDisabled}
              sx={roundBtnSxMemo}
            >
              {/* <AddIcon /> */}
              <Icon baseClassName="material-symbols-outlined">add_notes</Icon>
            </IconButton>
        </Tooltip>
      

      {/* ダイスページへのリンク */}
        <IconButton
          color="primary"
          href="/dice" // ← app/dice/page.tsx を作る想定
          sx={roundBtnSxMain}
        >🎲
        </IconButton>
        
      </Stack>

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
