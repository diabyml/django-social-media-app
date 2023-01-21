from django.contrib import admin

# Register your models here.
from .models import User,Feed,Comment,SubComment

admin.site.register(User)
admin.site.register(Feed)
admin.site.register(Comment)
admin.site.register(SubComment)
