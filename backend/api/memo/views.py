from rest_framework import viewsets, filters
from .models import Horse, Note
from .serializers import HorseSerializer, NoteSerializer

class HorseViewSet(viewsets.ModelViewSet):
    queryset = Horse.objects.all().order_by("id")
    serializer_class = HorseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name"]


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.select_related("horse").all().order_by("-updated_at")
    serializer_class = NoteSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "body", "horse__name"]
    ordering_fields = ["created_at", "updated_at", "id"]

    def get_queryset(self):
        qs = super().get_queryset()
        horse_id = self.request.query_params.get("horse")
        if horse_id:
            qs = qs.filter(horse_id=horse_id)
        return qs
