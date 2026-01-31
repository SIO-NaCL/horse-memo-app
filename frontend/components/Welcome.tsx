"use client";
// Welcome コンポーネントは、競馬メモアプリケーションの初期画面を表示します。
// ユーザーが馬を選択していない場合に表示され、アプリの概要と使い方のヒントを提供します。
import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

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

       {/* ここから追加：ダイスページへのリンク */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          component={Link}
          href="/dice" // ← app/dice/page.tsx を作る想定
          variant="contained"
        >
          🎲 ランダム買い目（ダイス）へ
        </Button>

        {/* もしテキストリンクも欲しければ */}
        <Button
          component={Link}
          href="/dice"
          variant="text"
        >
          ページを開く
        </Button>
      </Stack>

    </Box>
  );
}
