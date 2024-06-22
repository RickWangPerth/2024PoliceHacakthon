# /backend/backend/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import os
import json

def send_to_chatroom(request):
    print("request.method is", request.method)
    if request.method == 'POST':
        message = request.POST.get('message')
        print(message)
        # 获取Channel Layer
        channel_layer = get_channel_layer()
        
        # 构建要发送的消息数据
        message_data = {
            'type': 'chat_message',
            'message': message
        }
        
        # 使用async_to_sync将异步发送转换为同步调用
        async_to_sync(channel_layer.group_send)(
            'chat_group',  # 指定要发送到的组名
            message_data
        )
        
        # 执行发送消息到聊天室的逻辑
        # ...
        
        # 返回成功响应
        return JsonResponse({'status': 'success'})
    else:
        # 处理非POST请求
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@api_view(['GET'])
def send_test_data(request):
    return Response({
        "data": "Hello from django backend"
    })
    
    
TWILIO_ACCOUNT_SID = os.environ['TWILIO_ACCOUNT_SID']
TWILIO_AUTH_TOKEN = os.environ['TWILIO_AUTH_TOKEN']
TWILIO_PHONE_NUMBER = os.environ['TWILIO_PHONE_NUMBER']
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def test_view(request):
    data = {
        'message': 'Hello, this is a test!'
    }
    return JsonResponse(data)

@csrf_exempt
def handle_call(request):
    from_number = request.POST.get('From')
    send_sms(from_number)

    response = VoiceResponse()
    response.say("Thank you for calling. You will receive an SMS shortly.")
    return HttpResponse(str(response), content_type='text/xml')

def send_sms(to_number):
    message = client.messages.create(
        body="Hi there. Click the link to share your location: https://www.cloudwa.com.au/emergency",
        from_=TWILIO_PHONE_NUMBER,
        to=to_number
    )
    return message.sid

@csrf_exempt
def location_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        # 处理接收到的位置信息
        print(f"Received location: Latitude = {latitude}, Longitude = {longitude}")
        return JsonResponse({'status': 'success', 'latitude': latitude, 'longitude': longitude})
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def incident_output_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        summarydata = data.get('data')
        # 处理接收到的位置信息
        print(f"Received incident_output_view: data = {data}")
        
        return JsonResponse({'status': 'success', 'data': data})
    return JsonResponse({'error': 'Invalid request method'}, status=400)



import asyncio
import websockets
import os

async def command_receiver():
    host = os.getenv('WEBSOCKET_HOST', 'localhost')
    port = os.getenv('WEBSOCKET_PORT', '8000')
    ws_url = f"wss://{host}:{port}/ws/"
    async with websockets.connect(ws_url) as websocket:
        
        while True:
            message = await websocket.recv()
            await websocket.send("Received the command '{message}'")
            if message == "start":
                # run the start command
                ...
            elif message == "stop":
                # run the stop command
                ...
            else:
                await websocket.send("Unknown command")     
