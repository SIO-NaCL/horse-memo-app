"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Chip,
  Paper,
} from "@mui/material";

/**
 * 競馬の「買い目（枠番号）」をランダムに出力する単ページ（page.tsxだけで完結）
 * - 枠数: 1〜18
 * - 振る目の数: 1〜枠数
 * - 重複なしのランダム数字を出力
 */

function sampleUniqueNumbers(max: number, count: number): number[] {
  // 1..max を作ってシャッフル → 先頭 count 個
  const arr = Array.from({ length: max }, (_, i) => i + 1);

  // Fisher–Yates shuffle（in-place）
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0..i
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count).sort((a, b) => a - b);
}

export default function Page() {
  const [frames, setFrames] = useState<number>(18); // 枠数
  const [count, setCount] = useState<number>(3); // 振る目の数
  const [result, setResult] = useState<number[]>([]);

  // count の選択肢は 1..frames
  const countOptions = useMemo(() => {
    return Array.from({ length: frames }, (_, i) => i + 1);
  }, [frames]);

  const handleChangeFrames = (nextFrames: number) => {
    setFrames(nextFrames);
    // 枠数を減らしたとき、count が枠数を超えないように調整
    setCount((prev) => Math.min(prev, nextFrames));
    // 結果も一旦クリア（好みで消さない運用でもOK）
    setResult([]);
  };

  const handleGenerate = () => {
    const picked = sampleUniqueNumbers(frames, count);
    setResult(picked);
  };

  const handleReset = () => {
    setResult([]);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          競馬 買い目ランダム生成
        </Typography>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* 枠数 */}
            <FormControl fullWidth>
              <InputLabel id="frames-label">枠数（1〜18）</InputLabel>
              <Select
                labelId="frames-label"
                label="枠数（1〜18）"
                value={frames}
                onChange={(e) => handleChangeFrames(Number(e.target.value))}
              >
                {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 振る目の数 */}
            <FormControl fullWidth>
              <InputLabel id="count-label">振る目の数（1〜枠数）</InputLabel>
              <Select
                labelId="count-label"
                label="振る目の数（1〜枠数）"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {countOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleGenerate}>
              ランダム生成
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              クリア
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            出力（重複なし）
          </Typography>

          {result.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              まだ生成されていません。「ランダム生成」を押してください。
            </Typography>
          ) : (
            <>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {result.map((n) => (
                  <Chip key={n} label={n} />
                ))}
              </Stack>

              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                文字列: {result.join(", ")}
              </Typography>
            </>
          )}
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          ※ 「枠数 = {frames}」「振る目の数 = {count}」で、1〜{frames}の範囲から重複なしで選びます。
        </Typography>
      </Box>
    </>
  );
}
