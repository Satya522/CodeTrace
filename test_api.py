import urllib.request
import json

url = "http://localhost:3000/api/trace"
data = {
    "language": "python",
    "version": "3.10.0",
    "code": "global_list = [10, 20]\n\ndef recursive_sum(n):\n    if n <= 1:\n        return 1\n    return n + recursive_sum(n - 1)\n\ndef main():\n    val = recursive_sum(3)\n    global_list.append(val)\n    print(\"Done:\", val)\n\nmain()"
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(json.dumps(result, indent=2)[:500])
except urllib.error.HTTPError as e:
    print(f"Error: {e.code}")
    print(e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}")
