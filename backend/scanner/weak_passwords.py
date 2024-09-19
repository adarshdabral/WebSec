import requests

def weakpasswords(target_url):
    passwords = ["123456", "password", "admin", "welcome"]
    vulnerable_passwords = []

    for password in passwords:
        test_url = f"{target_url}/login"
        payload = {'username': 'admin', 'password': password}
        try:
            response = requests.post(test_url, data=payload)
            if "Login successful" in response.text:
                vulnerable_passwords.append(password)
        except requests.RequestException:
            continue
        except NameError as e:
            return 202, "This website does not exist."

    if vulnerable_passwords == []:
        return 200, "No unused passwords in the admin account."
    else:
        return 202, vulnerable_passwords