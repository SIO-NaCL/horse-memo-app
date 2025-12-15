from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HorseViewSet, NoteViewSet

router = DefaultRouter()
router.register(r"horses", HorseViewSet, basename="horse")
router.register(r"notes", NoteViewSet, basename="note")

urlpatterns = [
    path("", include(router.urls)),
]