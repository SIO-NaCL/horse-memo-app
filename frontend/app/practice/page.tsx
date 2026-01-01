"use client";

import React, { useState } from "react";
import { Box, Button, CssBaseline, Typography, Stack } from "@mui/material";
import NoteDialog from "@/components/NoteDialog";

/**
 * practice/page.tsx
 * NoteDialog が「親からどんな props を渡されて動くか」を確認するための最小サンプル。
 *
 * - 「新規メモを開く」ボタンで NoteDialog を開く（新規モード想定）
 * - title/body/url は親（このページ）側の state として持ち、props で NoteDialog に渡す
 * - onChangeTitle などで NoteDialog からの入力変更を親が受け取って state 更新する
 * - onClose は「閉じるだけ」、onAfterClose で「閉じ切った後にリセット」（見た目チラつき防止）
 */

export default function PracticePage() {
  // Dialog開閉
  const [open, setOpen] = useState(false);

  // NoteDialog の入力値（親が持つ）
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");

  // 「新規モード」で開く（入力欄は空にしてから開く）
  const openNew = () => {
    setTitle("");
    setBody("");
    setUrl("");
    setOpen(true);
  };

  // 「編集モード」で開く
  const openEdit = () => {
    setTitle("既存タイトル");
    setBody("既存内容");
    setUrl("https://example.com");
    setOpen(true);
  };

  // Noteダイアログを閉じる
  const requestCloseDialog = () => {
  setOpen(false); // ←閉じるだけ
  };
  // ダイアログ閉じた後に状態リセット
  const resetDialogState = () => {
    setTitle("");
    setBody("");
    setUrl("");
  };

  // 送信（今回はDB連携しない。親が受け取れることだけ確認）
  const submit = () => {
    console.log("submit (practice)", { title, body, url });
    setOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          NoteDialog props 確認（practice）
        </Typography>

        <Stack direction="column" spacing={2} sx={{ mb: 2, maxWidth: 260 }}>
          <Button variant="contained" onClick={openNew}>
            新規モードを開く
          </Button>

          <Button variant="contained" onClick={openEdit}>
            編集モードで開く
          </Button>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">親が持っている state（確認用）</Typography>
          <pre style={{ marginTop: 8, padding: 12, background: "#f5f5f5" }}>
            {JSON.stringify({ open, title, body, url }, null, 2)}
          </pre>
        </Box>

        <NoteDialog
          open={open}
          dialogTitle="新規Note追加（practice）"
          submitText="追加"
          title={title}
          body={body}
          url={url}
          onChangeTitle={setTitle}
          onChangeBody={setBody}
          onChangeUrl={setUrl}
          onClose={requestCloseDialog}
          onAfterClose={resetDialogState}
          onSubmit={submit}
          onClear={() => {
            setTitle("");
            setBody("");
            setUrl("");
          }}
        />
      </Box>
    </>
  );
}
