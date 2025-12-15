from .base import *
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