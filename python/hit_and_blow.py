import random
import sys

from pprint import pprint


class Game:
    def __init__(self, count: int = 5, digit=4):
        self.user_inputs = []
        self.count = count
        self.digit = digit
        # NOTE: 0～9から重複無し
        self.answer = random.sample(list(range(10)), self.digit)

    def play(self):
        init_val = self.count
        while self.count > 0:
            your_input = input(
                f"[In:{init_val - self.count}]"
                "4桁の数字を入力してください\n>"
            )

            if len(your_input) != 4:
                print("桁数が不正です。やり直してください...")
                continue

            self.user_inputs.append(your_input)

            hits = set()
            blows = set()
            dic = {int(i): "-" for i in your_input}
            for i, j in zip(your_input, self.answer):
                i = int(i)
                if i == j:
                    hits.add(i)
                    dic[i] = "H"
                elif i in self.answer:
                    blows.add(i)
                    dic[i] = "B"

            print(dic)

            for v in dic.values():
                print(v, end="")
            else:
                print()

            if len(hits) == len(self.answer):
                print(f"正解です！{[your_input]}")
                break

                # print(i, j)

            print()
            print("[Blows]:\t", blows if blows else "None")
            print("[Hits]:\t\t", hits if hits else "None")
            print()

            self.count -= 1
        else:
            print(f"実行回数制限を超えました。正解は{self.answer}でした。")

        print("gameを終了します")

        return

    def debug(self):
        return


def main():
    game = Game()
    game.play()
    return


if __name__ == "__main__":
    main()

