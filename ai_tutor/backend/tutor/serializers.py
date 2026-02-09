from rest_framework import serializers
from .models import Assignment, Submission
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["created_by", "created_at"]

class SubmissionSerializer(serializers.ModelSerializer):
    assignment_title = serializers.CharField(
        source="assignment.title", read_only=True
    )
    student = serializers.CharField(
        source="user.username", read_only=True
    )

    class Meta:
        model = Submission
        fields = [
            "id",
            "student",
            "assignment_title",
            "code",
            "feedback",
            "teacher_comment",
            "created_at",
        ]
        read_only_fields = ["created_at"]



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser

        return token