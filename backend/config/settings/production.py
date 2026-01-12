# backend/config/settings/production.py
from .base import *  # noqa
import os

DEBUG = False

# 本番は必ず環境変数から
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

# "horse-memo.sionacl.org" みたいなCSV想定
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if h.strip()]
if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["horse-memo.sionacl.org"]

# Django 4.0+ 以降、CSRF_TRUSTED_ORIGINS は scheme 必須（https:// を含める）:contentReference[oaicite:5]{index=5}
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.environ.get("DJANGO_CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()]
if not CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS = ["https://horse-memo.sionacl.org"]

# Nginx などリバプロ配下で https を正しく認識させる（https終端するなら入れておくのが無難）
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# CookieをHTTPS限定（HTTPS化できたら True 推奨。Djangoのデプロイチェックリストでも推奨）:contentReference[oaicite:6]{index=6}
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# MySQL（docker-compose.prod.yml で渡してる値を読む）:contentReference[oaicite:7]{index=7}
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ["DB_NAME"],
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.environ["DB_HOST"],
        "PORT": os.environ.get("DB_PORT", "3306"),
        "OPTIONS": {"charset": "utf8mb4"},
    }
}

# 静的ファイル（adminを使う/使わないに関わらず本番は定義しておくと楽）
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
