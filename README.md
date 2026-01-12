# Horse Memo App（馬名メモアプリ）

馬ごとにメモ（ノート）を作成・編集・削除できる、学習用途で作成したフルスタックWebアプリです。  
Next.js（App Router）+ Django REST Framework（DRF）+ MySQL を Docker で動かしています。

- **公開URL**: https://horse-memo.sionacl.org/

---

## 主な機能

- 馬（Horse）の一覧表示 / 追加
- メモ（Note）の一覧表示（馬ごと） / 追加 / 編集 / 削除
- メモのソート（更新日時など）
- URLルーティング（`/:horseId` で馬を選択）

---

## 技術構成

### Frontend
- **Next.js**（App Router）
- **TypeScript**
- **MUI（Material UI）**

### Backend
- **Django**
- **Django REST Framework（DRF）**
- Gunicorn（本番起動）

### Database
- **MySQL 8**

### Infra / Deploy
- Docker / Docker Compose
- Nginx（リバースプロキシ）
- Let’s Encrypt（Certbot）で HTTPS 化
- VPS（さくらのVPS）

---

## ディレクトリ構成（概要）

```
horse-memo-app/
  frontend/        # Next.js
  backend/         # Django + DRF
  docker-compose.prod.yml
  .env.prod        # 本番用（※Git管理しない/ローカルで管理）
```

---

## ローカル開発（概要）

本リポジトリは、開発時に **VS Code Dev Containers** を使って `frontend/` と `backend/` をそれぞれコンテナで開発する想定です。  
（DBは docker-compose で起動）

> ※ 開発環境の詳細はプロジェクトの進行に合わせて更新します。

---

## 本番デプロイ（Docker Compose）

### 1) 環境変数ファイルを用意（例：`.env.prod`）

`.env.prod` は **機密情報を含むため Git にコミットしない**でください。

例：

```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_PASSWORD=your_appuser_password

DJANGO_SECRET_KEY=your_django_secret_key
DJANGO_ALLOWED_HOSTS=horse-memo.sionacl.org,127.0.0.1,localhost
DJANGO_CSRF_TRUSTED_ORIGINS=https://horse-memo.sionacl.org
```

### 2) 起動

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

### 3) マイグレーション

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend python manage.py migrate
```

---

## API（概要）

- Horse
  - `GET /api/memo/horses/`
  - `POST /api/memo/horses/`
- Note
  - `GET /api/memo/notes/?horse=<id>`
  - `POST /api/memo/notes/`
  - `PATCH /api/memo/notes/<id>/`
  - `DELETE /api/memo/notes/<id>/`

---

## ライセンス

学習目的の個人開発プロジェクトです。必要に応じて追記します。

---

## 作者

- GitHub: https://github.com/SIO-NaCL
