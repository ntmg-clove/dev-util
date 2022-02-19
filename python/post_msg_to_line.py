import sys
import json
from pprint import pprint

import requests

# NOTE: 設定値を読み込む。事前に設定する必要あり。
from settings import *


# print(URL)


def main(arg: str):

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {CH_ACCESS_TOKEN}",
    }
    data = {"to": USER_ID, "messages": [{"type": "text", "text": arg}]}
    # j_data = json.dumps(data)

    response = requests.post(URL, headers=headers, json=data)

    ret_code = response.status_code
    results = response.json()

    print(ret_code)
    pprint(results)

    return


if __name__ == "__main__":
    arg = ""
    for i in sys.stdin:
        arg += i

    main(arg)
