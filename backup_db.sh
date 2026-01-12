#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p backups
chmod 700 backups

ts="$(date +%F_%H%M%S)"
out="backups/race_memo_${ts}.sql.gz"

docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T db sh -lc \
  'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --quick --routines --triggers race_memo' \
  | gzip > "$out"

# 直近14個だけ残す（必要に応じて数を変更）
ls -1t backups/race_memo_*.sql.gz | tail -n +15 | xargs -r rm -f

echo "Backup written: $out"

# 復元方法
# cd ~/horse-memo-app
# gzip -dc backups/race_memo_YYYY-MM-DD_HHMMSS.sql.gz \
#   | docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T db sh -lc \
#     'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" race_memo'