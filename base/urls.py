from django.urls import path
from . import views

app_name = 'base'
urlpatterns = [
    path('',views.index,name='index'),
    path('user/',views.user),
    path('feeds/',views.feeds,name='feeds'),
    path('feeds/<int:feed_id>',views.feed,name='feed'),
    path('feeds/<int:feed_id>/comments',views.feed_comments,name='feed_comments'),
    path('new-feed/',views.new_feed),
    path('new-comment/',views.new_comment),
    path('test',views.testForm)
]