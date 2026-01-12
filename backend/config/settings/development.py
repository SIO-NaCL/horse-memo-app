from .base import *
import os

DEBUG = True
ALLOWED_HOSTS = ["*"]  # 開発は雑でOK

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'race_memo',
    'USER': 'root1',
    'PASSWORD': 'password1',
    'HOST': 'host.docker.internal',
    'PORT': 53306,
    'ATOMIC_REQUESTS': True
  }
}