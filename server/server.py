import os
import json
import random
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url
from tornado.web import StaticFileHandler
from tornado.websocket import WebSocketHandler


class SharedMemory():
    return_status = 200


class TestPage(RequestHandler):

    def src_check(self, request):
        eip = request.remote_ip
        if 'X-Forwarded-For' in request.headers.keys():
            sip = self.request.headers['X-Forwarded-For']
        else:
            sip = 'NoData'
        print("sip: %s, eip: %s" % (sip, eip))

    def get(self, *args, **kwargs):
        self.src_check(self.request)
        status = SharedMemory.return_status
        self.clear()
        self.set_status(status)
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'GET')
        self.finish("TestPage %d" % status)

    def post(self, *args, **kwargs):
        self.src_check()

        edgeip = ''
        comment = ''

        try:
            data = json.loads(self.request.body)
            edgeip = data['edgeip']
            comment = data['comment']
        except:
            pass
        else:
            print("edgeip: %s, comment: %s" % (edgeip, comment))

        status = SharedMemory.return_status
        self.clear()
        self.set_status(status)
        self.finish("TestPage %d" % status)

class PostHandler(RequestHandler):

    def get(self, *args, **kwargs):
        self.write("Get not allowed")

    def post(self, *args, **kwargs):
        try:
            data = json.loads(self.request.body)
            if data['type'] == 'return_status':
                SharedMemory.return_status = int(data['status'])
                self.write("Set Return Status : %s" % data['status'])
            else:
                self.write("Syntax Error")
        except:
            self.write("Syntax Error")


class NetStatHandler(WebSocketHandler):

    waiters = set()
    netstat = []

    def open(self, *args, **kwargs):
        print("open")
        self.waiters.add(self)

        message = {'command': 'update', 'data': self.netstat}
        self.write_message(message)

    def check_origin(self, origin):
        return True

    def _datadecode(self, message):
        try:
            result = json.loads(message)
            command = result['command']
            data = result['data']
        except Exception as e:
            command = None
            data = None

        return (command, data)

    def _replase(self, data):
        self.netstat = data

        message = {'command': 'update', 'data': self.netstat}
        for waiter in self.waiters:
            if waiter == self:
                continue
            waiter.write_message(message)

    def on_message(self, message):
        #print("on message")
        command, data = self._datadecode(message)

        if command == 'replace':
            self._replase(data)
        else:
            pass

    def on_close(self):
        print("close")
        self.waiters.remove(self)



class AdminServer(Application):

    def __init__(self):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        Application.__init__(
            self,
            [
                url(r'/ws', NetStatHandler, name='ws'),
                url(r'/post', PostHandler, name='posthandler'),
                url(r'/(.*)', StaticFileHandler, {'path': BASE_DIR,'default_filename':'index.html'}),
            ],
        )


class TestServer(Application):

    def __init__(self):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        path_favicon = os.path.join(BASE_DIR, './favicon.ico')
        Application.__init__(
            self,
            [
                url(r'/test', TestPage, name='testpage'),
                #url(r'/(favicon\.ico)', StaticFileHandler, {"path": path_favicon}),
            ],
            #template_path=os.path.join(BASE_DIR, 'templates'),
            static_path=BASE_DIR,
        )


if __name__ == '__main__':
    asv = AdminServer()
    admin_http_server = HTTPServer(asv)
    admin_http_server.listen(3200)

    tsv = TestServer()
    test_http_server = HTTPServer(tsv)
    test_http_server.listen(8000)

    IOLoop.instance().start()
