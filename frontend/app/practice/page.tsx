"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; httpStatus: number; data: unknown }
  | { status: "error"; message: string; details?: unknown };

export default function PracticePage() {
  const ENDPOINT = "/api/memo/notes/"; // ← あなたのDjango APIに合わせて変更

  const [state, setState] = React.useState<FetchState>({ status: "idle" });

  const testFetch = async () => {
    setState({ status: "loading" });

    try {
      const res = await fetch(ENDPOINT, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const contentType = res.headers.get("content-type") ?? "";
      const body = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        setState({
          status: "error",
          message: `HTTP ${res.status} ${res.statusText}`,
          details: body,
        });
        return;
      }

      setState({ status: "success", httpStatus: res.status, data: body });
    } catch (e) {
      setState({
         status: "error",
         message: e instanceof Error ? e.message : "Fetch failed",
         details: e,
      });
    }
  };

  return (
    <Box sx={{ p: 3, display: "grid", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Practice: Django API 疎通テスト
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Endpoint: <b>{ENDPOINT}</b>
        </Typography>

        <Button variant="contained" onClick={testFetch} disabled={state.status === "loading"}>
          {state.status === "loading" ? "Fetching..." : "GET を叩く"}
        </Button>

        <Box sx={{ mt: 2 }}>
          {state.status === "loading" && <CircularProgress size={24} />}

          {state.status === "error" && (
            <Alert severity="error">
              <div>{state.message}</div>
              {state.details !== undefined && (
                <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                  {typeof state.details === "string"
                    ? state.details
                    : JSON.stringify(state.details, null, 2)}
                </pre>
              )}
            </Alert>
          )}

          {state.status === "success" && (
            <Alert severity="success">
              <div>OK! HTTP {state.httpStatus}</div>
              <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(state.data, null, 2)}
              </pre>
            </Alert>
          )}

          {state.status === "idle" && (
            <Alert severity="info">ボタンを押すとAPIを叩いて結果を表示します。</Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
