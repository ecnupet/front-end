#!/usr/bin/python3

from urllib import request
import hmac
import datetime
import base64
import json

URL = "https://open.feishu.cn/open-apis/bot/v2/hook/99cb553f-b5ca-409e-a743-f08d07913929"
KEY = '8kYHSSz7t7REuSyIrrWCwh'


def get_sign(timestamp: int, key: str):
    payload = str(timestamp) + "\n" + key
    hash_bytes = hmac.new(payload.encode("utf8"), digestmod="sha256").digest()
    return base64.b64encode(hash_bytes).decode("utf8")


def send_message(message: str):
    date = datetime.datetime.now()
    timestamp = int(date.timestamp())
    payload = {
        'timestamp': str(timestamp), 
        'sign': get_sign(timestamp, KEY),
        'msg_type': 'text',
        'content': {
            'text': message
        }
    }
    data = json.JSONEncoder().encode(payload).encode('utf-8')
    headers = {"Content-Type": 'application/json'}
    pending_request = request.Request(URL, data=data, method="POST", headers=headers)
    result = request.urlopen(pending_request)
    print("Server response:")
    print(result.read().decode('utf8'))
    print("Send message finished.")


if __name__ == '__main__':
    all_message = []
    while True:
        try:
            all_message.append(input())
        except EOFError:
            break
    send_message('\n'.join(all_message))
