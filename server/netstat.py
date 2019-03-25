from tornado.ioloop import IOLoop, PeriodicCallback
from tornado.websocket import websocket_connect, WebSocketClosedError
import psutil
import json
import asyncio
import datetime

class NetStatClient(object):

    def __init__(self, url):
        self.url = url
        self.connect()
        self.connections = {}

    async def _fetch_ws(self):
        try:
            self.ws = await websocket_connect(self.url)
        except ConnectionRefusedError as e:
            print("%s seems to be down." % self.url)
            raise e

    def connect(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self._fetch_ws())

    async def _write_info(self):
        while True:
            await asyncio.sleep(1)

            for k in self.connections.keys():
                self.connections[k]['status'] = 'REMOVED'

            for c in psutil.net_connections():
                if (
                        c.type.name == 'SOCK_STREAM'
                        and c.raddr
                        and (c.laddr.port == 80 or c.laddr.port == 443)
                        #and (c.laddr.ip == '10.0.0.191')
                ):
                    connection = {
                        'type': c.type.name,
                        'laddr': c.laddr.ip,
                        'lport': c.laddr.port,
                        'raddr': c.raddr.ip,
                        'rport': c.raddr.port,
                    }

                    k = str(connection)
                    if  k in self.connections.keys():
                        self.connections[k]['status'] = c.status
                        self.connections[k]['keptime'] = datetime.datetime.now().timestamp() - self.connections[k]['stime']
                    else:
                        self.connections[k] = connection
                        self.connections[k]['id'] = len(self.connections)
                        self.connections[k]['status'] = c.status
                        self.connections[k]['stime'] = datetime.datetime.now().timestamp()
                        self.connections[k]['keptime'] = 0

            connections = list(map(lambda x: self.connections[x], self.connections.keys()))
            data = {
                'command': 'replace',
                'data': connections,
                'timestamp': datetime.datetime.now().timestamp(),
            }

            try:
                self.ws.write_message(json.dumps(data))
            except WebSocketClosedError:
                return

    def run(self):
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self._write_info())

if __name__ == "__main__":
    #url = "ws://localhost:3000/ws"
    url = "ws://localhost:3000/ws"
    nsc = NetStatClient(url)
    nsc.run()
