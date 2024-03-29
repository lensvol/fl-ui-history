import http.client
import re
import ssl
import sys


if __name__ == "__main__":
    branch = "www"
    if len(sys.argv) > 1:
        branch = sys.argv[1]

    if branch not in ("www", "beta", "staging"):
        print(f"Invalid FL environment: {branch}")
        exit(-1)

    # Disable certificate verification
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    # Connect to the site over HTTPS
    conn = http.client.HTTPSConnection(f"{branch}.fallenlondon.com", context=context)

    # Retrieve the contents of index.html
    conn.request("GET", "/index.html")
    response = conn.getresponse()
    data = response.read().decode("utf-8")

    # Define the regular expression pattern to extract commit ID
    pattern = r'.*/static/js/main\.([0-9a-z]+)\.chunk\.js.*'
    match = re.search(pattern, data)

    if not match:
        print("Commit ID not found in the retrieved contents.")
        exit(-1)

    script_id = match.group(1)
    print(f"{script_id}")
