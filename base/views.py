from django.shortcuts import render

from base.forms import FeedForm
from .models import Feed,Comment,User
from django.http import HttpResponseNotFound, JsonResponse
import json


def testForm(request):
    form = FeedForm()
    return render(request,'base/test.html',{'form':form})

# Create your views here.
def index(request):
    return render(request, 'base/index.html')

def user(request):
    return JsonResponse({
        'id':1,
        'firstName':'ADAMA',
        'lastName': 'DIABY'
    })

def feeds(request):
    feeds = Feed.objects.all()
    # feeds_list = [ feed for feed in feeds if True ]
    feeds_list = []

    # transform Feed objects to serializable (dict)
    for feed in feeds:
        feeds_list.append({
            'id':feed.id,
            'title':feed.title,
            'excerpt':feed.excerpt,
            'content': feed.content,
            'image':feed.image.url,
            'user': {
                'id':feed.user.id,
                'first_name': feed.user.first_name,
                'last_name': feed.user.last_name
            }
        })

    return JsonResponse(feeds_list,safe=False)

def feed(request,feed_id):
    feed = Feed.objects.get(pk=feed_id)
    return JsonResponse({
        'id':feed.id,
            'title':feed.title,
            'excerpt':feed.excerpt,
            'content': feed.content,
            'image':feed.image.url,
            'user': {
                'id':feed.user.id,
                'first_name': feed.user.first_name,
                'last_name': feed.user.last_name
            }
    },safe=False)

def feed_comments(request,feed_id):
    feed = Feed.objects.get(pk=feed_id)
    comments_query_set = Comment.objects.filter(feed=feed)

    comments = []
    for comment in comments_query_set:
        comments.append({
            'id':comment.id,
            'content': comment.content,
            'feedId': comment.feed.id,
            'user': {
                'firstName': comment.user.first_name,
                'lastName': comment.user.last_name,
            }
        })

    return JsonResponse(comments,safe=False)

def new_feed(request):
    if request.method == 'POST':
        print(request.POST['title'])
        # data = json.loads(request.body.decode('utf-8'))
        # user_id = int(data['userId'])
        # user = User.objects.all()[0]
        feed = Feed(
            title=request.POST['title'],
            excerpt=request.POST['excerpt'],
            content= request.POST['content'],
            user=user,
            image=request.FILES['image']
        )
        feed.save()
        return JsonResponse({'response':'ok'})
    else:
        return HttpResponseNotFound('404')

def new_comment(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        content = data['content']
        feed_id = int(data['feedId'])
        user_id = int(data['userId'])
        current_feed = Feed.objects.get(pk=feed_id)
        current_user = User.objects.get(pk=user_id)
        comment = Comment(content=content,feed=current_feed,user=current_user)
        comment.save()
        return JsonResponse({
            'response':'ok'
        })
    else:
        return HttpResponseNotFound('404')