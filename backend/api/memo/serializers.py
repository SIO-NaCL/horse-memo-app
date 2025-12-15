from rest_framework import serializers
from .models import Horse, Note

class HorseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horse
        fields = ["id", "name"]


class NoteSerializer(serializers.ModelSerializer):
    horse_name = serializers.CharField(source="horse.name", read_only=True)

    class Meta:
        model = Note
        fields = ["id", "horse", "horse_name", "title", "body", "url", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]