import os
import sys
import random
import time
import requests # For sending HTTP request to update database.

import socket
import threading

import base64
import numpy as np
from tkinter import Label, Tk
import pandas as pd
from Crypto.Cipher import AES
from Crypto import Random

MESSAGE_SIZE = 3 # position, 1 action, sync

class Server(threading.Thread):
    def __init__(self, ip_addr, port_num, dancer_num):
        super(Server, self).__init__()

        self.timeout = 600
        self.has_no_response = False
        self.connection = None
        self.timer = None
        self.logout = False

        # Create a TCP/IP socket and bind to port
        self.shutdown = threading.Event()
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (ip_addr, port_num)

        print('Starting up on %s port %s' % server_address, file=sys.stderr)
        self.socket.bind(server_address)

        # Listen for incoming connections
        self.socket.listen(1)
        self.client_address, self.secret_key = self.setup_connection() 

    def decrypt_message(self, cipher_text):
        decoded_message = base64.b64decode(cipher_text)
        iv = decoded_message[:16]
        secret_key = bytes(str(self.secret_key), encoding="utf8") 
        cipher = AES.new(secret_key, AES.MODE_CBC, iv)
        decrypted_message = cipher.decrypt(decoded_message[16:]).strip()
        decrypted_message = decrypted_message.decode('utf8')

        decrypted_message = decrypted_message[decrypted_message.find('#'):]
        decrypted_message = bytes(decrypted_message[1:], 'utf8').decode('utf8')

        messages = decrypted_message.split('|')
        position, action, sync = messages[:MESSAGE_SIZE]

        print("position: " + position + ", action: " + action + ", sync: " + sync)
        return {
            'position': position, 'action': action, 'sync':sync
        }

    def run(self):
        while not self.shutdown.is_set():
            data = self.connection.recv(1024)

            if data:
                try:
                    msg = data.decode("utf8")
                    decrypted_message = self.decrypt_message(msg)
                    positions = decrypted_message['position'].split(' ')

                    pos1, pos2, pos3 = positions[:3]

                    #INSERT YOUR CODE HERE

                    #TODO UPDATE TO DATABASE
                    url = "http://202.166.37.137:5000/main/update/B14/0"
                    headers = {
                            'Content-Type': 'application/json'
                            }

                    # In a function, convert decrypted_message to json format
                    # Currently, our json format is as such: 
                    payload = [ 
                        {
                            "username": "dancer1",
                            "current_dance_move": decrypted_message['action'],
                            "current_position": pos1,
                            "time_started": decrypted_message['sync']
                        },
                        {
                            "username": "dancer2",
                            "current_dance_move": decrypted_message['action'],
                            "current_position": pos2,
                            "time_started": decrypted_message['sync']
                        },
                        {
                            "username": "dancer3",
                            "current_dance_move": decrypted_message['action'],
                            "current_position": pos3,
                            "time_started": decrypted_message['sync']
                        }
                    ]
                    response = requests.post(url, json=payload, headers=headers)
                    print(response.text)

                    #######################
                except Exception as e:
                    print(e)
            else:
                print('no more data from', self.client_address, file=sys.stderr)
                self.stop()
    def setup_connection(self):
        # Wait for a connection
        print('Waiting for Ultra96 to connect.')
        self.connection, client_address = self.socket.accept()

        secret_key = "BF7EE4A12FA30C12826CD8A4DC1546A6"

        print('connection from ', client_address, file=sys.stderr)
        return client_address, secret_key

    def stop(self):
        self.connection.close()
        self.shutdown.set()
        self.timer.cancel()

def main():
    ip_addr = '0.0.0.0'
    server = Server(ip_addr, 5555, 1)
    server.start()

if __name__ == '__main__':
    main()

