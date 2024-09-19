import socket
import dns.resolver
import whois

def gather_website_info(url):
    result = []
    hostname = url.replace("https://", "").replace("http://", "").split('/')[0]
    
    try:
        ip = socket.gethostbyname(hostname)
        result.append(f"IP Address: {ip}")
    except Exception as e:
        result.append(f"Error fetching IP address: {e}")
    
    try:
        dns_info = []
        
        a_records = dns.resolver.resolve(hostname, 'A')
        dns_info.append(f"DNS Info for {hostname}:")
        for ipval in a_records:
            dns_info.append(f"A Record: {ipval.to_text()}")
        
        mx_records = dns.resolver.resolve(hostname, 'MX')
        for mx in mx_records:
            dns_info.append(f"MX Record: {mx.exchange} with preference {mx.preference}")
        
        ns_records = dns.resolver.resolve(hostname, 'NS')
        for ns in ns_records:
            dns_info.append(f"NS Record: {ns.to_text()}")
        
        txt_records = dns.resolver.resolve(hostname, 'TXT')
        for txt in txt_records:
            dns_info.append(f"TXT Record: {txt.to_text()}")
        
        result.extend(dns_info)
    except Exception as e:
        result.append(f"Error fetching DNS info: {e}")
    
    try:
        domain_info = whois.whois(hostname)
        whois_info = [
            "\nWHOIS Information:",
            f"Domain Name: {domain_info.domain_name}",
            f"Registrar: {domain_info.registrar}",
            f"Creation Date: {domain_info.creation_date}",
            f"Expiration Date: {domain_info.expiration_date}",
            f"Nameservers: {domain_info.name_servers}",
            f"Status: {domain_info.status}"
        ]
        result.extend(whois_info)
    except Exception as e:
        result.append(f"Error fetching WHOIS info: {e}")
    
    if result == []:
        return 202, "No Details Found"
    else:
        return '\n'.join(result)