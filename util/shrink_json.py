import json
import copy

from pprint import pprint


# NOTE: input target filepath.
filepath = "target.json"


def load():
    with open(filepath, encoding="utf-8") as f:
        data = json.load(f)
    return data


def shrink_lst(org: list):
    _size = len(org)
    if _size == 0:
        return [None, _size]

    first = org[0]

    if type(first) == str:
        org = ["string", _size]

    elif type(first) in [int, float]:
        org = ["number", _size]

    elif type(first) == bool:
        org = ["bool", _size]

    elif type(first) == dict:
        tmp = []
        for elem in org[:3]:
            tmp.append(shrink(elem, {}))
        tmp.append(len(org))
        org = tmp

    elif type(first) == list:
        tmp = []
        for elem in org[:3]:
            tmp.append(shrink_lst(elem))
        tmp.append(len(org))
        org = tmp

    return org


def shrink(org: dict, buf: dict):
    # print("[buf]")
    # pprint(buf)
    buf = copy.deepcopy(buf)

    for k, v in org.items():
        # print(k, v)
        # print(type(k), type(v))

        if type(v) == str:
            buf[k] = "string"

        elif type(v) in (int, float):
            buf[k] = "number"

        elif type(v) == bool:
            buf[k] = "bool"

        elif type(v) == dict:
            buf[k] = shrink(v, buf)

        elif type(v) == list:
            buf[k] = shrink_lst(v)

    return buf


if __name__ == "__main__":
    data = load()
    shrinked = shrink(data, {})

    sample = json.dumps(shrinked, ensure_ascii=False, indent=4)

    print(sample)

