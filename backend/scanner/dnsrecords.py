import dns.resolver

def find_dns_records(domain):
    domain = domain.replace("https://", "").replace("http://", "").strip("/")

    record_types = ['A', 'AAAA', 'MX', 'NS', 'TXT']
    dns_records = []

    for record_type in record_types:
        try:
            answers = dns.resolver.resolve(domain, record_type)
            record_list = [answer.to_text() for answer in answers]
            dns_records.append(f"{record_type} records for {domain}: {', '.join(record_list)}")
        except dns.resolver.NoAnswer:
            dns_records.append(f"{record_type} records for {domain}: No record found")
        except dns.resolver.NXDOMAIN:
            return 202, f"Domain {domain} does not exist"
        except Exception as e:
            dns_records.append(f"{record_type} records for {domain}: Error: {str(e)}")
        finally:
            if dns_records == []:
                return 202, "No DNS traces found"
            else:
                return 200, dns_records