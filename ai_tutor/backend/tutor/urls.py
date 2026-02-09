from django.urls import path
from .views import AssignmentList, SubmitCode, SubmissionList,RegisterUser, MySubmissions, AddAssignment,TeacherAllSubmissions,TeacherAddComment,EditAssignment,DeleteAssignment


urlpatterns = [
    path("assignments/", AssignmentList.as_view()),
    path("submit/", SubmitCode.as_view()),
    path("submissions/", SubmissionList.as_view()),
    path("register/", RegisterUser.as_view()),
    path("my-submissions/", MySubmissions.as_view()),
    path("add-assignment/", AddAssignment.as_view()),
    path("teacher/submissions/", TeacherAllSubmissions.as_view()),
    path("teacher/comment/<int:pk>/", TeacherAddComment.as_view()),
    path("teacher/assignment/edit/<int:pk>/", EditAssignment.as_view()),
    path("teacher/assignment/delete/<int:pk>/", DeleteAssignment.as_view()),
]
