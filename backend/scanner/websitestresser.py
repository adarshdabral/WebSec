import socket
from urllib.request import urlopen
from urllib.error import *

def getAddr(url):
    ip = socket.gethostbyname(url)
    return ip, 200

def SocketStress(url):
    ports = [445, 8080, 5000]
    newurl = url.replace("https://", "")
    newurl = newurl.replace("http://", "")
    try:
        ip = socket.gethostbyname(newurl)
    except NameError as e:
        return 200, "This website is either using antiflood features or does not exist."

    print(f"IP address fetched: {ip}")
    print("Working on the exploit")

    for port in ports:
        for attempt in range(10):
            try:
                s = socket.socket()
                s.settimeout(5)
                s.connect((ip, port))
                print(f"Successfully connected to port {port} on attempt {attempt + 1}")
            except (ConnectionError, ConnectionResetError, socket.timeout) as e:
                print(f"Port {port} is not open or connection failed: {e}")
                break
            finally:
                s.close()
    try:
       html = urlopen(url)
    except (HTTPError, URLError) as e:
        return 202, "Website is offline!"
    finally:
        return 200, "Website was attacked, it did not go offline"