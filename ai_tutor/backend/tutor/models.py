from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assignments"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.TextField()
    feedback = models.TextField(blank=True)
    teacher_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
