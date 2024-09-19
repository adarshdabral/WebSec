from flask import Flask, request
from flask_cors import CORS
from scanner.websitestresser import SocketStress
from scanner.sql_injection import sqlscanner
from scanner.xss import xssVulnurable
from scanner.weak_passwords import weakpasswords
from scanner.deface import defacesite
from scanner.dnsrecords import find_dns_records
from scanner.fullscan import full_attack
from scanner.generalinfo import gather_website_info
app = Flask(__name__)
CORS(app)

@app.route('/sqlscan', methods=["POST"])
def sqlscan():
    print("Request hit for SQL scan")
    data = request.json
    
    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = sqlscanner(url)
        return message, status_code
    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500

@app.route('/password', methods=["POST"])
def passwords():
    print("Request hit for a password crack attempt")
    data = request.json
    
    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = weakpasswords(url)
        return message, status_code
    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500

@app.route('/webstresser', methods=["POST"])
def webstresser():
    print("Request hit for Website stresser")
    data = request.json

    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = SocketStress(url)
        return message, status_code
    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500

@app.route('/xss', methods=["POST"])
def xss():
    print("Request hit for XSS exploit implementation")
    data = request.json
    
    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = xssVulnurable(url)
        return message, status_code
    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500

@app.route('/deface', methods=['POST'])
def deface():
    print("Request hit for a deface attack")
    data = request.json

    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = defacesite(url)
        return message, status_code
    except Exception as e:
        print("Error : ", e)
        return str(e), 500

@app.route('/basicscan', methods=['POST'])
def basicscan():
    print("Request hit for a basic info gathering")
    data = request.json

    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = gather_website_info(url)
        return message, status_code
    except Exception as e:
        print("Error : ", e)
        return str(e), 500

@app.route('/dnsrecord', methods=['POST'])
def dnsrecords():    
    print("Request hit for a dns record scan")
    data = request.json

    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = find_dns_records(url)
        return message, status_code
    except Exception as e:
        print("Error : ", e)
        return str(e), 500

@app.route('/fullscan', methods=['POST'])
def fullscan():
    print("Request hit for a full scan")
    data = request.json

    if not data:
        return "Invalid Website", 202
    
    url = data.get("website", "")
    print(f"Obtained : {url}")
    try:
        status_code, message = full_attack(url)
        return message, status_code
    except Exception as e:
        print("Error : ", e)
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10037, debug=True)