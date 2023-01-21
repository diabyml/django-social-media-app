from django.db import models

# Create your models here.
from django.db import models

# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Feed(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.CharField(max_length=200)
    content = models.TextField()
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='feeds')
    image = models.ImageField(upload_to='images')

    def __str__(self):
        return f"{self.title} {self.user}"

class Comment(models.Model):
    content = models.TextField()
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='comments')
    feed = models.ForeignKey(Feed,on_delete=models.CASCADE,related_name='comments')

    def __str__(self):
        return f"{self.content}"

class SubComment(models.Model):
    content = models.TextField()
    comment = models.ForeignKey(Comment,on_delete=models.CASCADE,related_name='sub_comments')
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='sub_comments')

    def __str__(self):
        return f"{self.content}"


