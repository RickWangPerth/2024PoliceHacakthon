from django.urls import re_path
from . import consumer

websocket_urlpatterns = [
    re_path(r'^api/ws/chat/$', consumer.ChatConsumer.as_asgi()),
]

print("WebSocket URL route set")


