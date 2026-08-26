global_list = [10, 20]

def recursive_sum(n):
    if n <= 1:
        return 1
    return n + recursive_sum(n - 1)

def main():
    val = recursive_sum(3)
    global_list.append(val)
    print("Done:", val)

main()
