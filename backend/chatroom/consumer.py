from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel_name = "chatroom_demo"
        print("WebSocket connection established, name: ", self.channel_name)
        await self.channel_layer.group_add("chat", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        print(f"WebSocket connection closed, code: {close_code}")
        await self.channel_layer.group_discard("chat", self.channel_name)

    async def receive(self, text_data):
        print(f"received msg: {text_data}")
        await self.channel_layer.group_send(
            "chat",
            {
                "type": "chat_message",
                "message": text_data,
            },
        )

    async def chat_message(self, event):
        message = event["message"]
        print(f"Msg sent:{message}")
        await self.send(text_data=message)