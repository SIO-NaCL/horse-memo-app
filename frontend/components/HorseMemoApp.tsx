"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, CssBaseline, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

import HorseSidebar from "@/components/HorseSidebar";
import NotesTable from "@/components/NotesTable";
import NoteDialog from "@/components/NoteDialog";
import Welcome from "@/components/Welcome";
import HorseDialog from "@/components/HorseDialog";
import ConfirmDialog from "@/components/ConfirmDialog";

import {  apiGet, apiPost, apiPatch, apiDelete, normalizeList } from "@/lib/api";
import type { SortKey, SortOrder } from "@/lib/types";

// APIレスポンスに合わせた型（Noteは horse: number を想定）
type Horse = { id: number; name: string };
type Note = {
  id: number;
  horse: number;
  title: string;
  body: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export default function HorseMemoApp(props: { selectedHorseId: number | null }) {
  const { selectedHorseId } = props;
  const router = useRouter();

  // ---- UI state（ソート/ダイアログ） ----
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // ---- API state（horses/notes） ----
  const [horses, setHorses] = useState<Horse[]>([]);
  const [horsesLoading, setHorsesLoading] = useState(false);
  const [horsesError, setHorsesError] = useState<string | null>(null);

  const [notesRaw, setNotesRaw] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  const [isHorseDialogOpen, setIsHorseDialogOpen] = useState(false);
  const [newHorseName, setNewHorseName] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  // 編集対象の Note ID
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // 起動時に Horse 一覧取得
  const fetchHorses = async (signal?: AbortSignal) => {
      try {
        setHorsesLoading(true);
        setHorsesError(null);

        const data = await apiGet<unknown>("/api/memo/horses/", signal);
        const list = normalizeList<Horse>(data);

        setHorses(list);
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        setHorsesError(e instanceof Error ? e.message : String(e));
      } finally {
        setHorsesLoading(false);
      }
    };

    // Note再取得の関数
    const fetchNotes = async (horseId: number, signal?: AbortSignal) => {
      try {
        setNotesLoading(true);
        setNotesError(null);

        const data = await apiGet<unknown>(
          `/api/memo/notes/?horse=${encodeURIComponent(String(horseId))}`,
          signal
        );
        setNotesRaw(normalizeList<Note>(data));
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        setNotesError(e instanceof Error ? e.message : String(e));
      } finally {
        setNotesLoading(false);
      }
    };

    // Note削除確定処理
    const confirmDelete = async () => {
      if (!deleteTarget) return;
      if (!selectedHorseId) return;

      try {
        setNotesError(null);

        await apiDelete(`/api/memo/notes/${deleteTarget.id}/`);

        setDeleteTarget(null);

        // 削除後に一覧再取得
        await fetchNotes(selectedHorseId);
      } catch (e) {
        setNotesError(e instanceof Error ? e.message : String(e));
      }
    };
    

  useEffect(() => {
    const controller = new AbortController();
    fetchHorses(controller.signal);
    return () => controller.abort();
  }, []); 


  // selectedHorseId が変わったら Note 一覧取得
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      // Horse未選択なら notes は空に
      if (!selectedHorseId) {
        setNotesRaw([]);
        setNotesError(null);
        setNotesLoading(false);
        return;
      }

      try {
        setNotesLoading(true);
        setNotesError(null);

        const data = await apiGet<unknown>(
          `/api/memo/notes/?horse=${encodeURIComponent(String(selectedHorseId))}`
        );
        const list = normalizeList<Note>(data);

        if (controller.signal.aborted) return;

        setNotesRaw(list);
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        setNotesError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!controller.signal.aborted) setNotesLoading(false);
      }
    })();

    return () => controller.abort();
  }, [selectedHorseId]);

  // Horse一覧はあいうえお順に
  const sortedHorses = useMemo(() => {
    return [...horses].sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }, [horses]);

  const selectedHorse = useMemo(() => {
    if (!selectedHorseId) return null;
    return sortedHorses.find((h) => h.id === selectedHorseId) || null;
  }, [sortedHorses, selectedHorseId]);

  // Notesはローカルでソート
  const notes = useMemo(() => {
    const arr = [...notesRaw];
    arr.sort((a, b) => {
      const aTime = new Date(a[sortKey]).getTime();
      const bTime = new Date(b[sortKey]).getTime();
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });
    return arr;
  }, [notesRaw, sortKey, sortOrder]);

  const handleSelectHorse = (id: number) => {
    router.push(`/${id}`);
  };

  const handleOpenDialog = () => {
    if (!selectedHorseId) return;
    setEditingNoteId(null); // ← 新規モード(新規で開く時は編集IDをリセット)
    setIsDialogOpen(true); // 編集モード
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNoteId(null);
    setNewTitle("");
    setNewBody("");
    setNewUrl("");
  };

  const handleSubmit = async () => {
    if (!selectedHorseId) return;

    try {
      setNotesError(null);

      if (editingNoteId === null) {
        // --- 新規作成（POST） ---
        await apiPost<Note, { horse: number; title: string; body: string; url: string }>(
          "/api/memo/notes/",
          {
            horse: selectedHorseId,
            title: newTitle,
            body: newBody,
            url: newUrl,
          }
        );
      } else {
        // --- 編集（PATCH） ---
        await apiPatch<Note, { title: string; body: string; url: string }>(
          `/api/memo/notes/${editingNoteId}/`,
          {
            title: newTitle,
            body: newBody,
            url: newUrl,
          }
        );
      }

      // 成功したら閉じて一覧更新
      handleCloseDialog();
      await fetchNotes(selectedHorseId);
    } catch (e) {
      setNotesError(e instanceof Error ? e.message : String(e));
    }
  };

const handleSubmitHorse = async () => {
  const name = newHorseName.trim();
  if (!name) return;

  try {
    setHorsesError(null);

    // 1) POSTでHorse作成
    const created = await apiPost<Horse, { name: string }>(
      "/api/memo/horses/",
      { name }
    );

    // 2) ダイアログ閉じる
    setIsHorseDialogOpen(false);
    setNewHorseName("");

    // 3) 一覧を再取得（確実）
    await fetchHorses();

    // 4) 作った馬のページへ（選択状態にする）
    router.push(`/${created.id}`);
  } catch (e) {
    setHorsesError(e instanceof Error ? e.message : String(e));
  }
};

  const sidebarWidth = 260;

  const showMainLoading =
    (selectedHorseId && horsesLoading) || (selectedHorseId && notesLoading);

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <HorseSidebar
          width={sidebarWidth}
          horses={sortedHorses}
          selectedHorseId={selectedHorseId}
          onSelectHorse={handleSelectHorse}
          onAddNote={handleOpenDialog}
          onAddHorse={() => setIsHorseDialogOpen(true)}
        />

        <Box sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          {/* Horses取得エラー */}
          {horsesError && (
            <Typography color="error" sx={{ mb: 2 }}>
              Horse一覧の取得に失敗しました: {horsesError}
            </Typography>
          )}

          {/* Notes取得エラー */}
          {notesError && (
            <Typography color="error" sx={{ mb: 2 }}>
              Note一覧の取得に失敗しました: {notesError}
            </Typography>
          )}

          {/* ローディング（/1でhorse名がまだ引けない時など） */}
          {showMainLoading && (
            <Box
              sx={{
                height: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                読み込み中...
              </Typography>
            </Box>
          )}

          {/* Horse未選択（/） */}
          {!selectedHorseId && !showMainLoading && <Welcome />}

          {/* Horse選択中（/:horseId） */}
          {selectedHorseId && !showMainLoading && (
            <>
              {selectedHorse ? (
                <NotesTable
                  horseName={selectedHorse.name}
                  notes={notes}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSortChange={(k, o) => {setSortKey(k); setSortOrder(o);}}
                  onDeleteNote={(id, title) => setDeleteTarget({ id, title })}
                  onRowClick={(noteId) => {
                    const target = notesRaw.find((n) => n.id === noteId);
                    if (!target) return;
                    setEditingNoteId(target.id);
                    setNewTitle(target.title);
                    setNewBody(target.body);
                    setNewUrl(target.url);
                    setIsDialogOpen(true);
                  }}
                />
              ) : (
                <Typography>
                  指定のHorse（id={selectedHorseId}）が見つかりません。
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      <NoteDialog
        open={isDialogOpen}
        dialogTitle={editingNoteId === null ? "新規Note追加" : "Note編集"}
        submitText={editingNoteId === null ? "追加" : "更新"}
        title={newTitle}
        body={newBody}
        url={newUrl}
        onChangeTitle={setNewTitle}
        onChangeBody={setNewBody}
        onChangeUrl={setNewUrl}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        onClear={() => {
          setNewTitle("");
          setNewBody("");
          setNewUrl("");
        }}
      />

      <HorseDialog
        open={isHorseDialogOpen}
        name={newHorseName}
        onChangeName={setNewHorseName}
        onClose={() => {
          setIsHorseDialogOpen(false);
          setNewHorseName("");
        }}
        onSubmit={handleSubmitHorse}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="メモを削除しますか？"
        message={deleteTarget ? `「${deleteTarget.title}」を削除します。\nこの操作は元に戻せません。` : ""}
        confirmText="削除"
        cancelText="キャンセル"
        isDanger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

    </>
  );
}
