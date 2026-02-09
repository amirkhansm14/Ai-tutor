from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer,MyTokenObtainPairSerializer
from .ai_service import generate_ai_feedback
from rest_framework import status
from .serializers import SubmissionSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import UpdateAPIView
from django.shortcuts import get_object_or_404

class AssignmentList(APIView):
    def get(self, request):
        data = Assignment.objects.all()
        serializer = AssignmentSerializer(data, many=True)
        return Response(serializer.data)


class SubmitCode(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        assignment_id = request.data.get("assignment")
        code = request.data.get("code")

        assignment = Assignment.objects.get(id=assignment_id)

        feedback = generate_ai_feedback(code, assignment.description)

        Submission.objects.create(
            student=request.user,
            assignment=assignment,
            code=code,
            feedback=feedback
        )

        return Response({"feedback": feedback})
    
class SubmissionList(APIView):
    def get(self, request):
        submissions = Submission.objects.all().order_by("-id")
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
    
#student  registration
class RegisterUser(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            password=password
        )

        return Response({"message": "User registered successfully"})


class MySubmissions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        submissions = Submission.objects.filter(student=request.user)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class AddAssignment(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        assignment = serializer.save(created_by=request.user)  # ✅ CRITICAL LINE
        return Response(AssignmentSerializer(assignment).data, status=201)
    
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class TeacherAllSubmissions(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        submissions = Submission.objects.filter(
            assignment__created_by=request.user
        ).select_related("student", "assignment")

        data = []
        for s in submissions:
            data.append({
                "id": s.id,
                "student": s.student.username,
                "assignment": s.assignment.title,
                "code": s.code,
                "feedback": s.feedback,
                "teacher_comment": s.teacher_comment,
                "created_at": s.created_at
            })

        return Response(data)


class TeacherAddComment(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        submission = Submission.objects.get(
            pk=pk,
            assignment__created_by=request.user
        )
        submission.teacher_comment = request.data.get("comment")
        submission.save()
        return Response({"message": "Comment added"})
    
class TeacherAssignments(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        assignments = Assignment.objects.filter(created_by=request.user)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

class EditAssignment(UpdateAPIView):
    queryset = Assignment.objects.all()          # 🔥 REQUIRED
    serializer_class = AssignmentSerializer      # 🔥 REQUIRED
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        assignment = get_object_or_404(
            Assignment,
            pk=pk,
            created_by=request.user
        )

        serializer = AssignmentSerializer(
            assignment,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DeleteAssignment(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        assignment = Assignment.objects.get(pk=pk, created_by=request.user)
        assignment.delete()
        return Response({"message": "Assignment deleted"})
