"""
コラッツ予想のシミュレーション
"""

import sys


num = int(input())
cnt = 0

while True:
    print(cnt, num)
    if num == 1:
        break

    if num % 2 == 0:
        num //= 2
    else:
        num = 3 * num + 1

    cnt += 1

print(f"{cnt} times!")
