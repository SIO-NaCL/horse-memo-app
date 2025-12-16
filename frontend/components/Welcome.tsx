"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function Welcome() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1">
        競馬メモへようこそ
      </Typography>
      <Typography variant="body1">
        左の Horse 一覧から馬を選択すると、
        <br />
        その馬に紐づくメモがここに表示されます。
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ※機能仕様に合わせて、使い方ガイドなどをここに表示予定
      </Typography>
    </Box>
  );
}
