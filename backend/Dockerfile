# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# mysqlclient を使うならビルド依存が必要になることがある
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential default-libmysqlclient-dev \
    pkg-config \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.lock* /app/

RUN pip install --no-cache-dir -U pip \
 && if [ -f requirements.lock ]; then pip install --no-cache-dir -r requirements.lock; \
    else pip install --no-cache-dir -r requirements.txt; fi

COPY . /app/

EXPOSE 8000

# まずはシンプルに起動（worker数は後で調整）
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--access-logfile", "-", "--error-logfile", "-"]

