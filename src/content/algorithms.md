<div align="center">
  <img src="https://img.shields.io/badge/The_Ultimate_Library-CodeTrace-06B6D4?style=for-the-badge&logo=codeforces&logoColor=black" alt="Algorithms Banner" />
  
  # The CodeTrace Master Library
  **The ultimate, all-in-one cheat sheet for Languages, DSA, and Databases.**
</div>

---

# Algorithms & Database Patterns — Complete Reference

A working reference of the most important DSA algorithms (Python) plus MongoDB and PostgreSQL patterns, with clean, runnable code for each.

## Table of Contents

**Part 1 — Data Structures & Algorithms**
1. [Sorting Algorithms](#1-sorting-algorithms)
2. [Searching Algorithms](#2-searching-algorithms)
3. [Graph Algorithms](#3-graph-algorithms)
4. [Dynamic Programming](#4-dynamic-programming)
5. [Trees](#5-trees)
6. [Greedy Algorithms](#6-greedy-algorithms)
7. [String Algorithms](#7-string-algorithms)
8. [Backtracking](#8-backtracking)
9. [Bit Manipulation](#9-bit-manipulation)

**Part 2 — MongoDB**
10. [MongoDB: CRUD & Query Basics](#10-mongodb-crud--query-basics)
11. [MongoDB: Aggregation Pipeline](#11-mongodb-aggregation-pipeline)
12. [MongoDB: Indexing](#12-mongodb-indexing)
13. [MongoDB: Schema Design Patterns](#13-mongodb-schema-design-patterns)
14. [MongoDB: Transactions & Bulk Ops](#14-mongodb-transactions--bulk-ops)

**Part 3 — PostgreSQL**
15. [PostgreSQL: Joins](#15-postgresql-joins)
16. [PostgreSQL: Subqueries & CTEs](#16-postgresql-subqueries--ctes)
17. [PostgreSQL: Window Functions](#17-postgresql-window-functions)
18. [PostgreSQL: Indexing](#18-postgresql-indexing)
19. [PostgreSQL: Common Patterns](#19-postgresql-common-patterns)
20. [PostgreSQL: Transactions & EXPLAIN](#20-postgresql-transactions--explain)

---

# Part 1 — Data Structures & Algorithms

All code below is Python 3, dependency-free, and can be run as-is.

## 1. Sorting Algorithms

### Bubble Sort
**Time:** O(n²) · **Space:** O(1) · Stable

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr
```

### Selection Sort
**Time:** O(n²) · **Space:** O(1) · Not stable

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
```

### Insertion Sort
**Time:** O(n²) worst, O(n) best · **Space:** O(1) · Stable

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
```

### Merge Sort
**Time:** O(n log n) · **Space:** O(n) · Stable

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return _merge(left, right)

def _merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### Quick Sort
**Time:** O(n log n) average, O(n²) worst · **Space:** O(log n) · Not stable

```python
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_idx = _partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def _partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

### Heap Sort
**Time:** O(n log n) · **Space:** O(1) · Not stable

```python
def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        _heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        _heapify(arr, i, 0)
    return arr

def _heapify(arr, n, i):
    largest = i
    left, right = 2 * i + 1, 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        _heapify(arr, n, largest)
```

### Counting Sort
**Time:** O(n + k) · **Space:** O(k) · Stable · Best for small integer ranges

```python
def counting_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1
    result = []
    for num, freq in enumerate(count):
        result.extend([num] * freq)
    return result
```

### Radix Sort
**Time:** O(d·(n + k)) · **Space:** O(n + k) · For non-negative integers

```python
def radix_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        _counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def _counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for num in arr:
        count[(num // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1
    for i in range(n):
        arr[i] = output[i]
```


## 2. Searching Algorithms

### Linear Search
**Time:** O(n) · **Space:** O(1)

```python
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1
```

### Binary Search (iterative)
**Time:** O(log n) · **Space:** O(1) · Requires sorted array

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

### Binary Search (recursive)
**Time:** O(log n) · **Space:** O(log n) (call stack)

```python
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)
```

### Binary Search on Answer (template)
Used when the answer space itself is monotonic — e.g. "minimum capacity to ship in D days".

```python
def binary_search_on_answer(lo, hi, feasible):
    """feasible(x) -> bool, True for all x >= answer. Returns smallest feasible x."""
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
```

## 3. Graph Algorithms

### Graph Representation (Adjacency List)

```python
from collections import defaultdict

class Graph:
    def __init__(self, directed=False):
        self.adj = defaultdict(list)
        self.directed = directed

    def add_edge(self, u, v, weight=1):
        self.adj[u].append((v, weight))
        if not self.directed:
            self.adj[v].append((u, weight))
```

### Breadth-First Search (BFS)
**Time:** O(V + E) · **Space:** O(V)

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    order = []
    queue = deque([start])
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor, _ in graph.adj[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order
```

### Depth-First Search (DFS) — recursive & iterative
**Time:** O(V + E) · **Space:** O(V)

```python
def dfs_recursive(graph, node, visited=None, order=None):
    if visited is None:
        visited, order = set(), []
    visited.add(node)
    order.append(node)
    for neighbor, _ in graph.adj[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited, order)
    return order

def dfs_iterative(graph, start):
    visited = set()
    order = []
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor, _ in reversed(graph.adj[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    return order
```

### Dijkstra's Algorithm (shortest path, non-negative weights)
**Time:** O((V + E) log V) with a heap · **Space:** O(V)

```python
import heapq

def dijkstra(graph, start):
    dist = {start: 0}
    pq = [(0, start)]
    visited = set()
    while pq:
        d, node = heapq.heappop(pq)
        if node in visited:
            continue
        visited.add(node)
        for neighbor, weight in graph.adj[node]:
            new_dist = d + weight
            if new_dist < dist.get(neighbor, float("inf")):
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    return dist
```

### Bellman-Ford Algorithm (handles negative weights, detects negative cycles)
**Time:** O(V · E) · **Space:** O(V)

```python
def bellman_ford(vertices, edges, start):
    """edges: list of (u, v, weight)"""
    dist = {v: float("inf") for v in vertices}
    dist[start] = 0
    for _ in range(len(vertices) - 1):
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != float("inf") and dist[u] + w < dist[v]:
            raise ValueError("Graph contains a negative-weight cycle")
    return dist
```

### Floyd-Warshall Algorithm (all-pairs shortest paths)
**Time:** O(V³) · **Space:** O(V²)

```python
def floyd_warshall(n, edges):
    """n: number of vertices (0-indexed). edges: list of (u, v, weight)."""
    INF = float("inf")
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist
```

### Topological Sort — Kahn's Algorithm (BFS-based)
**Time:** O(V + E) · **Space:** O(V) · DAGs only

```python
from collections import deque, defaultdict

def topological_sort_kahn(vertices, edges):
    """edges: list of (u, v) meaning u -> v"""
    indegree = {v: 0 for v in vertices}
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        indegree[v] += 1

    queue = deque([v for v in vertices if indegree[v] == 0])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) != len(vertices):
        raise ValueError("Graph has a cycle — no topological order exists")
    return order
```

### Topological Sort — DFS-based

```python
def topological_sort_dfs(vertices, adj):
    visited, order = set(), []

    def dfs(node):
        visited.add(node)
        for neighbor in adj[node]:
            if neighbor not in visited:
                dfs(neighbor)
        order.append(node)

    for v in vertices:
        if v not in visited:
            dfs(v)
    return order[::-1]
```

### Union-Find / Disjoint Set (with path compression + union by rank)
**Time:** ~O(α(n)) per operation (near constant) · **Space:** O(n)

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        return True
```

### Kruskal's Algorithm (Minimum Spanning Tree)
**Time:** O(E log E) · **Space:** O(V)

```python
def kruskal_mst(n, edges):
    """edges: list of (weight, u, v). Returns list of MST edges and total weight."""
    edges = sorted(edges)
    uf = UnionFind(n)
    mst, total_weight = [], 0
    for weight, u, v in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
    return mst, total_weight
```

### Prim's Algorithm (Minimum Spanning Tree)
**Time:** O(E log V) with a heap · **Space:** O(V)

```python
import heapq

def prim_mst(graph, start, n):
    visited = {start}
    edges = [(w, start, v) for v, w in graph.adj[start]]
    heapq.heapify(edges)
    mst, total_weight = [], 0

    while edges and len(visited) < n:
        w, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        visited.add(v)
        mst.append((u, v, w))
        total_weight += w
        for next_v, next_w in graph.adj[v]:
            if next_v not in visited:
                heapq.heappush(edges, (next_w, v, next_v))
    return mst, total_weight
```

### Cycle Detection — Directed Graph (DFS with recursion stack)

```python
def has_cycle_directed(vertices, adj):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {v: WHITE for v in vertices}

    def dfs(node):
        color[node] = GRAY
        for neighbor in adj[node]:
            if color[neighbor] == GRAY:
                return True
            if color[neighbor] == WHITE and dfs(neighbor):
                return True
        color[node] = BLACK
        return False

    return any(color[v] == WHITE and dfs(v) for v in vertices)
```

### Cycle Detection — Undirected Graph (Union-Find)

```python
def has_cycle_undirected(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):
            return True
    return False
```


## 4. Dynamic Programming

### Fibonacci — Memoization & Tabulation
**Time:** O(n) · **Space:** O(n) memo / O(1) tabulation-optimized

```python
def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

def fib_tabulation(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

### 0/1 Knapsack
**Time:** O(n · W) · **Space:** O(n · W), reducible to O(W)

```python
def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
    return dp[n][capacity]
```

### Coin Change — Minimum Coins (Unbounded Knapsack variant)
**Time:** O(n · amount) · **Space:** O(amount)

```python
def coin_change_min(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1
```

### Coin Change — Count Ways

```python
def coin_change_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]
```

### Longest Common Subsequence (LCS)
**Time:** O(m · n) · **Space:** O(m · n)

```python
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
```

### Longest Increasing Subsequence (LIS)
**Time:** O(n log n) with binary search · **Space:** O(n)

```python
import bisect

def lis_length(nums):
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)
```

### Edit Distance (Levenshtein)
**Time:** O(m · n) · **Space:** O(m · n)

```python
def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
```

### Matrix Chain Multiplication (minimum scalar multiplications)
**Time:** O(n³) · **Space:** O(n²)

```python
def matrix_chain_order(dims):
    """dims[i-1] x dims[i] is the size of matrix i. Returns min multiplication cost."""
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float("inf")
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n - 1]
```

### Subset Sum

```python
def subset_sum_exists(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for t in range(target, num - 1, -1):
            dp[t] = dp[t] or dp[t - num]
    return dp[target]
```

### House Robber (no two adjacent elements)
**Time:** O(n) · **Space:** O(1)

```python
def house_robber(nums):
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr
```

## 5. Trees

### Binary Tree Node & Traversals

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []

def preorder(root):
    return [root.val] + preorder(root.left) + preorder(root.right) if root else []

def postorder(root):
    return postorder(root.left) + postorder(root.right) + [root.val] if root else []

def level_order(root):
    if not root:
        return []
    from collections import deque
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
```

### Binary Search Tree — Insert, Search, Delete
**Time:** O(h) where h = tree height (O(log n) balanced, O(n) worst case)

```python
class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if node is None:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node

    def search(self, val):
        node = self.root
        while node:
            if val == node.val:
                return True
            node = node.left if val < node.val else node.right
        return False

    def delete(self, val):
        self.root = self._delete(self.root, val)

    def _delete(self, node, val):
        if node is None:
            return None
        if val < node.val:
            node.left = self._delete(node.left, val)
        elif val > node.val:
            node.right = self._delete(node.right, val)
        else:
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left
            successor = node.right
            while successor.left:
                successor = successor.left
            node.val = successor.val
            node.right = self._delete(node.right, successor.val)
        return node
```

### Trie (Prefix Tree)
**Time:** O(L) per operation, L = word length

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

### Segment Tree (range sum query + point update)
**Time:** O(log n) query/update, O(n) build · **Space:** O(n)

```python
class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        if self.n:
            self._build(arr, 0, 0, self.n - 1)

    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self._build(arr, 2 * node + 1, start, mid)
        self._build(arr, 2 * node + 2, mid + 1, end)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def update(self, idx, value):
        self._update(0, 0, self.n - 1, idx, value)

    def _update(self, node, start, end, idx, value):
        if start == end:
            self.tree[node] = value
            return
        mid = (start + end) // 2
        if idx <= mid:
            self._update(2 * node + 1, start, mid, idx, value)
        else:
            self._update(2 * node + 2, mid + 1, end, idx, value)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, l, r):
        return self._query(0, 0, self.n - 1, l, r)

    def _query(self, node, start, end, l, r):
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        mid = (start + end) // 2
        return self._query(2 * node + 1, start, mid, l, r) + \
               self._query(2 * node + 2, mid + 1, end, l, r)
```

### Fenwick Tree / Binary Indexed Tree (prefix sums)
**Time:** O(log n) query/update · **Space:** O(n)

```python
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def update(self, i, delta):
        i += 1  # 1-indexed internally
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)

    def prefix_sum(self, i):
        i += 1
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & (-i)
        return total

    def range_sum(self, l, r):
        return self.prefix_sum(r) - (self.prefix_sum(l - 1) if l > 0 else 0)
```

### Lowest Common Ancestor (LCA) — Binary Lifting
**Time:** O(log n) per query after O(n log n) preprocessing

```python
class LCA:
    def __init__(self, n, adj, root=0):
        import math
        self.LOG = max(1, math.ceil(math.log2(n + 1)))
        self.up = [[0] * n for _ in range(self.LOG)]
        self.depth = [0] * n
        visited = [False] * n

        def dfs(u, parent):
            visited[u] = True
            self.up[0][u] = parent
            for v in adj[u]:
                if not visited[v]:
                    self.depth[v] = self.depth[u] + 1
                    dfs(v, u)

        dfs(root, root)
        for k in range(1, self.LOG):
            for v in range(n):
                self.up[k][v] = self.up[k - 1][self.up[k - 1][v]]

    def query(self, u, v):
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        diff = self.depth[u] - self.depth[v]
        for k in range(self.LOG):
            if (diff >> k) & 1:
                u = self.up[k][u]
        if u == v:
            return u
        for k in range(self.LOG - 1, -1, -1):
            if self.up[k][u] != self.up[k][v]:
                u, v = self.up[k][u], self.up[k][v]
        return self.up[0][u]
```


## 6. Greedy Algorithms

### Activity Selection (maximum non-overlapping intervals)
**Time:** O(n log n) · **Space:** O(1)

```python
def activity_selection(activities):
    """activities: list of (start, end). Returns max set of non-overlapping activities."""
    activities = sorted(activities, key=lambda x: x[1])
    selected = [activities[0]]
    last_end = activities[0][1]
    for start, end in activities[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    return selected
```

### Huffman Coding (optimal prefix-free encoding)
**Time:** O(n log n) · **Space:** O(n)

```python
import heapq
from collections import Counter

class HuffmanNode:
    def __init__(self, char, freq):
        self.char, self.freq = char, freq
        self.left = self.right = None
    def __lt__(self, other):
        return self.freq < other.freq

def huffman_encode(text):
    freq = Counter(text)
    heap = [HuffmanNode(ch, f) for ch, f in freq.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(None, left.freq + right.freq)
        merged.left, merged.right = left, right
        heapq.heappush(heap, merged)

    codes = {}
    def build_codes(node, path=""):
        if node is None:
            return
        if node.char is not None:
            codes[node.char] = path or "0"
            return
        build_codes(node.left, path + "0")
        build_codes(node.right, path + "1")

    build_codes(heap[0])
    encoded = "".join(codes[ch] for ch in text)
    return encoded, codes
```

### Fractional Knapsack
**Time:** O(n log n) · **Space:** O(1)

```python
def fractional_knapsack(items, capacity):
    """items: list of (weight, value). Returns max value (fractions allowed)."""
    items = sorted(items, key=lambda x: x[1] / x[0], reverse=True)
    total_value = 0.0
    for weight, value in items:
        if capacity <= 0:
            break
        take = min(weight, capacity)
        total_value += take * (value / weight)
        capacity -= take
    return total_value
```

## 7. String Algorithms

### KMP (Knuth-Morris-Pratt) Pattern Matching
**Time:** O(n + m) · **Space:** O(m)

```python
def kmp_search(text, pattern):
    if not pattern:
        return []
    lps = _build_lps(pattern)
    matches = []
    i = j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                matches.append(i - j)
                j = lps[j - 1]
        elif j > 0:
            j = lps[j - 1]
        else:
            i += 1
    return matches

def _build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps
```

### Rabin-Karp Pattern Matching (rolling hash)
**Time:** O(n + m) average · **Space:** O(1)

```python
def rabin_karp_search(text, pattern, prime=101, base=256):
    n, m = len(text), len(pattern)
    if m > n:
        return []
    matches = []
    h = pow(base, m - 1, prime)
    pattern_hash = text_hash = 0

    for i in range(m):
        pattern_hash = (base * pattern_hash + ord(pattern[i])) % prime
        text_hash = (base * text_hash + ord(text[i])) % prime

    for i in range(n - m + 1):
        if pattern_hash == text_hash:
            if text[i:i + m] == pattern:
                matches.append(i)
        if i < n - m:
            text_hash = (base * (text_hash - ord(text[i]) * h) + ord(text[i + m])) % prime
            text_hash = text_hash % prime
    return matches
```

### Z-Algorithm (pattern matching / prefix function)
**Time:** O(n) · **Space:** O(n)

```python
def z_function(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

def z_search(text, pattern):
    combined = pattern + "$" + text
    z = z_function(combined)
    m = len(pattern)
    return [i - m - 1 for i in range(len(z)) if z[i] == m]
```

### Longest Palindromic Substring (expand around center)
**Time:** O(n²) · **Space:** O(1)

```python
def longest_palindromic_substring(s):
    if not s:
        return ""
    start, max_len = 0, 1

    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    for i in range(len(s)):
        len1 = expand(i, i)       # odd length
        len2 = expand(i, i + 1)   # even length
        curr_max = max(len1, len2)
        if curr_max > max_len:
            max_len = curr_max
            start = i - (curr_max - 1) // 2
    return s[start:start + max_len]
```

## 8. Backtracking

### N-Queens
**Time:** O(n!) worst case · **Space:** O(n²)

```python
def solve_n_queens(n):
    solutions = []
    cols, diag1, diag2 = set(), set(), set()
    board = []

    def backtrack(row):
        if row == n:
            solutions.append(["".join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            board.append(["."] * col + ["Q"] + ["."] * (n - col - 1))
            backtrack(row + 1)
            board.pop()
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)

    backtrack(0)
    return solutions
```

### Sudoku Solver
**Time:** O(9^(n·n)) worst case (heavily pruned in practice)

```python
def solve_sudoku(board):
    """board: 9x9 list of lists, '.' for empty cells. Solves in place."""
    def is_valid(r, c, val):
        for i in range(9):
            if board[r][i] == val or board[i][c] == val:
                return False
        box_r, box_c = 3 * (r // 3), 3 * (c // 3)
        for i in range(box_r, box_r + 3):
            for j in range(box_c, box_c + 3):
                if board[i][j] == val:
                    return False
        return True

    def backtrack():
        for r in range(9):
            for c in range(9):
                if board[r][c] == ".":
                    for val in "123456789":
                        if is_valid(r, c, val):
                            board[r][c] = val
                            if backtrack():
                                return True
                            board[r][c] = "."
                    return False
        return True

    backtrack()
    return board
```

### Permutations

```python
def permutations(nums):
    result = []
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i + 1:])
            path.pop()
    backtrack([], nums)
    return result
```

### Subsets (power set)

```python
def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result
```

### Combinations (choose k of n)

```python
def combinations(n, k):
    result = []
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    backtrack(1, [])
    return result
```

## 9. Bit Manipulation

### Common Bit Tricks

```python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

def count_set_bits(n):
    count = 0
    while n:
        n &= n - 1  # clears the lowest set bit
        count += 1
    return count

def single_number(nums):
    """Every element appears twice except one. Find it in O(n) time, O(1) space."""
    result = 0
    for num in nums:
        result ^= num
    return result

def get_bit(n, i):
    return (n >> i) & 1

def set_bit(n, i):
    return n | (1 << i)

def clear_bit(n, i):
    return n & ~(1 << i)

def toggle_bit(n, i):
    return n ^ (1 << i)

def swap_without_temp(a, b):
    a ^= b
    b ^= a
    a ^= b
    return a, b
```


---

# Part 2 — MongoDB

## 10. MongoDB: CRUD & Query Basics

```javascript
// Insert
db.users.insertOne({ name: "Asha", age: 28, tags: ["dev", "admin"] });
db.users.insertMany([{ name: "Ravi", age: 34 }, { name: "Meera", age: 22 }]);

// Find
db.users.find({ age: { $gte: 25 } });
db.users.find({ tags: "dev" });
db.users.find({ name: /^A/ });                    // regex — names starting with A
db.users.findOne({ _id: ObjectId("...") });

// Projection — only return specific fields
db.users.find({ age: { $gte: 25 } }, { name: 1, age: 1, _id: 0 });

// Update
db.users.updateOne({ name: "Asha" }, { $set: { age: 29 } });
db.users.updateMany({ age: { $lt: 18 } }, { $set: { minor: true } });
db.users.updateOne({ name: "Asha" }, { $inc: { age: 1 } });
db.users.updateOne({ name: "Asha" }, { $push: { tags: "verified" } });
db.users.updateOne({ name: "Asha" }, { $pull: { tags: "admin" } });

// Upsert — update if exists, insert if not
db.users.updateOne(
  { name: "New User" },
  { $set: { age: 30 } },
  { upsert: true }
);

// Delete
db.users.deleteOne({ name: "Ravi" });
db.users.deleteMany({ age: { $lt: 13 } });

// Sort, limit, skip (pagination)
db.users.find().sort({ age: -1 }).skip(20).limit(10);

// Common query operators
db.users.find({ age: { $gt: 18, $lt: 65 } });
db.users.find({ status: { $in: ["active", "pending"] } });
db.users.find({ status: { $nin: ["banned"] } });
db.users.find({ $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }] });
db.users.find({ $and: [{ age: { $gte: 18 } }, { verified: true }] });
db.users.find({ address: { $exists: true } });
```

## 11. MongoDB: Aggregation Pipeline

```javascript
// Group + count
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", totalSpent: { $sum: "$amount" }, orderCount: { $sum: 1 } } },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 },
]);

// $lookup — join two collections (like a SQL LEFT JOIN)
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer",
    },
  },
  { $unwind: "$customer" },
  { $project: { orderId: 1, amount: 1, "customer.name": 1, "customer.email": 1 } },
]);

// $unwind — flatten an array field into separate documents
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalSold: { $sum: "$items.qty" } } },
]);

// $facet — run multiple aggregation pipelines in one query (e.g. results + count for pagination)
db.products.aggregate([
  { $match: { category: "electronics" } },
  {
    $facet: {
      results: [{ $skip: 0 }, { $limit: 20 }],
      totalCount: [{ $count: "count" }],
    },
  },
]);

// $bucket — histogram-style grouping into ranges
db.products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 50, 100, 500, 1000],
      default: "1000+",
      output: { count: { $sum: 1 } },
    },
  },
]);

// Date-based grouping (e.g. sales per day)
db.orders.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      total: { $sum: "$amount" },
    },
  },
  { $sort: { _id: 1 } },
]);
```

## 12. MongoDB: Indexing

```javascript
// Single field index
db.users.createIndex({ email: 1 });                       // ascending
db.users.createIndex({ email: 1 }, { unique: true });      // unique constraint

// Compound index — order matters, supports queries on prefix fields too
db.orders.createIndex({ customerId: 1, createdAt: -1 });

// Text index — full-text search on string fields
db.articles.createIndex({ title: "text", body: "text" });
db.articles.find({ $text: { $search: "mongodb indexing" } });

// TTL index — auto-delete documents after a time period (e.g. sessions)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Partial index — index only documents matching a filter (saves space)
db.orders.createIndex(
  { status: 1 },
  { partialFilterExpression: { status: "pending" } }
);

// Check query performance
db.orders.find({ customerId: "123" }).explain("executionStats");

// List and drop indexes
db.orders.getIndexes();
db.orders.dropIndex("customerId_1_createdAt_-1");
```

## 13. MongoDB: Schema Design Patterns

```javascript
// EMBEDDING — good for one-to-few relationships, data read together
// e.g. a blog post with its comments
{
  _id: ObjectId("..."),
  title: "Intro to MongoDB",
  body: "...",
  comments: [
    { author: "Asha", text: "Great post!", createdAt: ISODate("...") },
    { author: "Ravi", text: "Very helpful.", createdAt: ISODate("...") },
  ],
}

// REFERENCING — good for one-to-many / many-to-many, large or independently-growing data
// e.g. an order referencing a customer by id
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),   // reference, not embedded
  items: [{ productId: ObjectId("..."), qty: 2 }],
  total: 4599,
}

// EXTENDED REFERENCE — embed a small denormalized snapshot alongside the reference
// avoids an extra $lookup for commonly-needed fields, at the cost of eventual staleness
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  customerSnapshot: { name: "Asha Verma", tier: "gold" },
  total: 4599,
}

// BUCKET PATTERN — group many small time-series documents into buckets
// e.g. IoT sensor readings, one document per hour instead of one per reading
{
  sensorId: "sensor-42",
  hour: ISODate("2026-08-23T09:00:00Z"),
  readings: [
    { minute: 0, value: 21.4 },
    { minute: 1, value: 21.5 },
    // ... up to 60 readings
  ],
  count: 60,
}
```

## 14. MongoDB: Transactions & Bulk Ops

```javascript
// Multi-document transaction — for operations that must succeed or fail together
const session = client.startSession();
try {
  session.startTransaction();
  db.accounts.updateOne(
    { _id: fromId }, { $inc: { balance: -amount } }, { session }
  );
  db.accounts.updateOne(
    { _id: toId }, { $inc: { balance: amount } }, { session }
  );
  session.commitTransaction();
} catch (err) {
  session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}

// Bulk write — batch multiple operations into one round trip
db.products.bulkWrite([
  { insertOne: { document: { name: "Widget", price: 9.99 } } },
  { updateOne: { filter: { name: "Gadget" }, update: { $set: { price: 14.99 } } } },
  { deleteOne: { filter: { name: "Discontinued Item" } } },
]);

// findOneAndUpdate — atomic read + update, returns the document
db.counters.findOneAndUpdate(
  { _id: "orderId" },
  { $inc: { seq: 1 } },
  { returnDocument: "after", upsert: true }
);
```


---

# Part 3 — PostgreSQL

## 15. PostgreSQL: Joins

```sql
-- Sample schema used throughout this section
-- customers(id, name, email)
-- orders(id, customer_id, amount, created_at)

-- INNER JOIN — only matching rows in both tables
SELECT o.id, c.name, o.amount
FROM orders o
INNER JOIN customers c ON c.id = o.customer_id;

-- LEFT JOIN — all customers, even those with no orders
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;

-- RIGHT JOIN — all orders, even ones with a missing customer reference
SELECT c.name, o.id AS order_id
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;

-- FULL OUTER JOIN — everything from both sides, matched where possible
SELECT c.name, o.id AS order_id
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;

-- SELF JOIN — e.g. employees table with a manager_id referencing the same table
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- CROSS JOIN — cartesian product (rarely used directly, but useful for generating combinations)
SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c;
```

## 16. PostgreSQL: Subqueries & CTEs

```sql
-- Subquery in WHERE
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE amount > 1000);

-- Correlated subquery
SELECT c.name,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
FROM customers c;

-- CTE (WITH clause) — improves readability for multi-step queries
WITH big_spenders AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  GROUP BY customer_id
  HAVING SUM(amount) > 5000
)
SELECT c.name, bs.total
FROM big_spenders bs
JOIN customers c ON c.id = bs.customer_id
ORDER BY bs.total DESC;

-- Recursive CTE — e.g. traversing an org chart / category tree
WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL          -- anchor: top of the hierarchy

  UNION ALL

  SELECT e.id, e.name, e.manager_id, oc.depth + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY depth, name;
```

## 17. PostgreSQL: Window Functions

```sql
-- ROW_NUMBER — unique sequential rank, no ties
SELECT name, amount,
  ROW_NUMBER() OVER (ORDER BY amount DESC) AS rank
FROM orders;

-- RANK / DENSE_RANK — ties share a rank; DENSE_RANK doesn't skip numbers after a tie
SELECT customer_id, amount,
  RANK() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS dense_rnk
FROM orders;

-- Running total per customer
SELECT customer_id, created_at, amount,
  SUM(amount) OVER (PARTITION BY customer_id ORDER BY created_at) AS running_total
FROM orders;

-- LAG / LEAD — compare a row to the previous/next row
SELECT customer_id, created_at, amount,
  LAG(amount) OVER (PARTITION BY customer_id ORDER BY created_at) AS prev_amount,
  amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY created_at) AS change
FROM orders;

-- NTILE — split rows into N roughly equal buckets (e.g. quartiles)
SELECT name, amount,
  NTILE(4) OVER (ORDER BY amount) AS quartile
FROM orders;

-- Top N per group — most common real-world window function use case
SELECT * FROM (
  SELECT customer_id, id, amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn
  FROM orders
) ranked
WHERE rn <= 3;
```

## 18. PostgreSQL: Indexing

```sql
-- B-tree — the default, good for equality and range queries (<, >, BETWEEN)
CREATE INDEX idx_orders_customer_id ON orders (customer_id);

-- Unique index
CREATE UNIQUE INDEX idx_customers_email ON customers (email);

-- Composite index — order matters, supports queries on the leading column(s)
CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);

-- Partial index — index only rows matching a condition (smaller, faster)
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- GIN index — good for JSONB, arrays, and full-text search
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_articles_search ON articles USING GIN (to_tsvector('english', body));

-- GiST index — good for geometric data and range types
CREATE INDEX idx_events_range ON events USING GIST (during);

-- Expression index — index the result of a function, not the raw column
CREATE INDEX idx_customers_lower_email ON customers (LOWER(email));

-- Inspect a query plan
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 10;
```

## 19. PostgreSQL: Common Patterns

```sql
-- Upsert — insert or update on conflict
INSERT INTO customers (id, name, email)
VALUES (1, 'Asha Verma', 'asha@example.com')
ON CONFLICT (id)
DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;

-- Offset pagination — simple, but gets slower on large offsets
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 40;

-- Keyset pagination — faster for large tables, uses the last seen value instead of OFFSET
SELECT * FROM orders
WHERE created_at < '2026-08-20 10:00:00'
ORDER BY created_at DESC
LIMIT 20;

-- Full text search
SELECT title, ts_rank(to_tsvector('english', body), query) AS rank
FROM articles, to_tsquery('english', 'postgres & indexing') query
WHERE to_tsvector('english', body) @@ query
ORDER BY rank DESC;

-- JSONB queries
SELECT * FROM products WHERE metadata @> '{"color": "red"}';
SELECT metadata->>'brand' AS brand FROM products WHERE metadata ? 'brand';

-- Common Table Expression for de-duplication (keep latest row per group)
DELETE FROM orders o
USING (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY customer_id, amount ORDER BY created_at DESC) AS rn
  FROM orders
) dupes
WHERE o.id = dupes.id AND dupes.rn > 1;

-- Generate a series (useful for filling gaps in time-series reports)
SELECT day::date, COALESCE(SUM(amount), 0) AS total
FROM generate_series('2026-08-01'::date, '2026-08-07'::date, '1 day') AS day
LEFT JOIN orders ON DATE(orders.created_at) = day
GROUP BY day
ORDER BY day;
```

## 20. PostgreSQL: Transactions & EXPLAIN

```sql
-- Basic transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- On error: ROLLBACK;

-- Savepoints — partial rollback within a transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT before_credit;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- if something goes wrong with the credit step only:
ROLLBACK TO SAVEPOINT before_credit;
COMMIT;

-- Isolation levels (default is READ COMMITTED)
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- ... queries ...
COMMIT;

-- Row-level locking — prevent concurrent updates to the same row
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;

-- Reading a query plan
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.name, SUM(o.amount)
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY SUM(o.amount) DESC
LIMIT 10;
-- Look for: Seq Scan (missing index?), actual time vs estimated,
-- and whether the planner's row estimates are close to reality.
```

---

## Notes

- DSA code is Python 3, dependency-free — copy any function directly into a file and run it.
- MongoDB examples use `mongosh` / driver-style syntax; adapt collection and field names to your schema.
- PostgreSQL examples assume standard SQL; a couple of functions (`to_tsvector`, `generate_series`, `GIN`/`GiST`) are Postgres-specific and won't work on MySQL/SQLite as written.
- This is a working reference, not an exhaustive one — it covers the algorithms and patterns that come up most often in interviews and real backend/database work. Ask if you want a specific topic (e.g. tries for autocomplete, sharding patterns, red-black trees) expanded further.
