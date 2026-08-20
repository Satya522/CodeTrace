// Curated algorithm snippet library — ready-to-run examples for each category
// These power the "Examples" dropdown in the UI

export interface PseudocodeLine {
  text: string;
  lines: number[];
}

export interface AlgorithmSnippet {
  id: string;
  name: string;
  category: "sorting" | "searching" | "datastructure" | "graph" | "recursion" | "pattern";
  language: string;
  code: string;
  pseudocode?: PseudocodeLine[];
}

// ─── JavaScript Snippets ───
export const JS_SNIPPETS: AlgorithmSnippet[] = [
  {
    id: "js-bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    language: "javascript",
    code: `// Bubble Sort — O(n²) time, O(1) space
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

const nums = [64, 34, 25, 12, 22, 11, 90];
const sorted = bubbleSort(nums);
console.log("Sorted:", sorted);`,
    pseudocode: [
      { text: "procedure bubbleSort( A : list of items )", lines: [2] },
      { text: "  n = length(A)", lines: [3] },
      { text: "  repeat", lines: [4] },
      { text: "    swapped = false", lines: [5] },
      { text: "    for i = 1 to n-1 inclusive do", lines: [6] },
      { text: "      if A[i-1] > A[i] then", lines: [7] },
      { text: "        swap(A[i-1], A[i])", lines: [8, 9, 10] },
      { text: "        swapped = true", lines: [11] },
      { text: "      end if", lines: [] },
      { text: "    end for", lines: [13] },
      { text: "  until not swapped", lines: [16] },
      { text: "end procedure", lines: [18] }
    ]
  },
  {
    id: "js-selection-sort",
    name: "Selection Sort",
    category: "sorting",
    language: "javascript",
    code: `// Selection Sort — O(n²) time, O(1) space
function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}

const nums = [29, 10, 14, 37, 13];
console.log("Sorted:", selectionSort(nums));`
  },
  {
    id: "js-binary-search",
    name: "Binary Search",
    category: "searching",
    language: "javascript",
    code: `// Binary Search — O(log n) time
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

const nums = [2, 3, 4, 10, 40];
const target = 10;
const result = binarySearch(nums, target);
console.log("Index:", result);`,
    pseudocode: [
      { text: "procedure binarySearch( A, target )", lines: [2] },
      { text: "  left = 0", lines: [3] },
      { text: "  right = length(A) - 1", lines: [4] },
      { text: "  while left <= right do", lines: [6] },
      { text: "    mid = floor((left + right) / 2)", lines: [7] },
      { text: "    if A[mid] == target then", lines: [9] },
      { text: "      return mid", lines: [10] },
      { text: "    else if A[mid] < target then", lines: [11] },
      { text: "      left = mid + 1", lines: [12] },
      { text: "    else", lines: [13] },
      { text: "      right = mid - 1", lines: [14] },
      { text: "    end if", lines: [] },
      { text: "  end while", lines: [16] },
      { text: "  return -1", lines: [18] },
      { text: "end procedure", lines: [19] }
    ]
  },
  {
    id: "js-linked-list",
    name: "Linked List",
    category: "datastructure",
    language: "javascript",
    code: `// Linked List — insert, traverse, reverse
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insert(data) {
    const node = new Node(data);
    node.next = this.head;
    this.head = node;
  }

  traverse() {
    let current = this.head;
    const result = [];
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}

const list = new LinkedList();
list.insert(30);
list.insert(20);
list.insert(10);
console.log("List:", list.traverse());`
  },
  {
    id: "js-stack",
    name: "Stack (LIFO)",
    category: "datastructure",
    language: "javascript",
    code: `// Stack — Last In, First Out
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
    console.log("Pushed:", item);
  }

  pop() {
    if (this.isEmpty()) return "Stack empty!";
    const item = this.items.pop();
    console.log("Popped:", item);
    return item;
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
stack.pop();
stack.pop();
console.log("Top:", stack.peek());`
  },
  {
    id: "js-fibonacci",
    name: "Fibonacci (Recursion)",
    category: "recursion",
    language: "javascript",
    code: `// Fibonacci — recursive with call tree visualization
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const n = 6;
const result = fibonacci(n);
console.log("fibonacci(" + n + ") =", result);`
  },
  {
    id: "js-star-pattern",
    name: "Star Pattern",
    category: "pattern",
    language: "javascript",
    code: `// Right-angled triangle star pattern
const rows = 5;
for (let i = 1; i <= rows; i++) {
  let line = "";
  for (let j = 1; j <= i; j++) {
    line += "* ";
  }
  console.log(line);
}`
  },
  {
    id: "js-insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    language: "javascript",
    code: `// Insertion Sort — O(n²) time, O(1) space
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

const nums = [12, 11, 13, 5, 6];
console.log("Sorted:", insertionSort(nums));`
  },
  {
    id: "js-merge-sort",
    name: "Merge Sort",
    category: "sorting",
    language: "javascript",
    code: `// Merge Sort — O(n log n) time, O(n) space
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

const nums = [38, 27, 43, 3, 9, 82, 10];
console.log("Sorted:", mergeSort(nums));`
  },
  {
    id: "js-quick-sort",
    name: "Quick Sort",
    category: "sorting",
    language: "javascript",
    code: `// Quick Sort — O(n log n) average, O(n²) worst
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

const nums = [10, 7, 8, 9, 1, 5];
console.log("Sorted:", quickSort(nums));`
  },
  {
    id: "js-queue",
    name: "Queue (FIFO)",
    category: "datastructure",
    language: "javascript",
    code: `// Queue — First In, First Out
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
    console.log("Enqueued:", item);
  }

  dequeue() {
    if (this.isEmpty()) return "Queue empty!";
    const item = this.items.shift();
    console.log("Dequeued:", item);
    return item;
  }

  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}

const q = new Queue();
q.enqueue(10);
q.enqueue(20);
q.enqueue(30);
q.dequeue();
q.dequeue();
console.log("Front:", q.front());`
  },
  {
    id: "js-hash-table",
    name: "Hash Table",
    category: "datastructure",
    language: "javascript",
    code: `// Simple Hash Table with chaining
class HashTable {
  constructor(size = 7) {
    this.table = new Array(size);
  }

  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.table.length;
  }

  set(key, value) {
    const idx = this.hash(key);
    if (!this.table[idx]) this.table[idx] = [];
    this.table[idx].push([key, value]);
    console.log("Set", key, "=", value, "at bucket", idx);
  }

  get(key) {
    const idx = this.hash(key);
    const bucket = this.table[idx];
    if (bucket) {
      for (const [k, v] of bucket) {
        if (k === key) return v;
      }
    }
    return undefined;
  }
}

const ht = new HashTable();
ht.set("name", "Alice");
ht.set("age", "25");
ht.set("city", "Mumbai");
console.log("name:", ht.get("name"));
console.log("age:", ht.get("age"));`
  },
  {
    id: "js-bfs",
    name: "BFS (Graph)",
    category: "graph",
    language: "javascript",
    code: `// Breadth-First Search on adjacency list
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const order = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    console.log("Visiting:", node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}

const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"]
};

console.log("BFS order:", bfs(graph, "A"));`
  },
  {
    id: "js-dfs",
    name: "DFS (Graph)",
    category: "graph",
    language: "javascript",
    code: `// Depth-First Search on adjacency list
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log("Visiting:", start);

  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return [...visited];
}

const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"]
};

console.log("DFS order:", dfs(graph, "A"));`
  },
];

// ─── Python Snippets ───
export const PYTHON_SNIPPETS: AlgorithmSnippet[] = [
  {
    id: "py-bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    language: "python",
    code: `# Bubble Sort — O(n²) time, O(1) space
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

nums = [64, 34, 25, 12, 22, 11, 90]
sorted_nums = bubble_sort(nums)
print("Sorted:", sorted_nums)`
  },
  {
    id: "py-binary-search",
    name: "Binary Search",
    category: "searching",
    language: "python",
    code: `# Binary Search — O(log n) time
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

sorted_arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
index = binary_search(sorted_arr, target)
print(f"Found {target} at index: {index}")`
  },
  {
    id: "py-fibonacci",
    name: "Fibonacci (Recursion)",
    category: "recursion",
    language: "python",
    code: `# Fibonacci — recursive
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

n = 6
result = fibonacci(n)
print(f"fibonacci({n}) = {result}")`
  },
  {
    id: "py-linked-list",
    name: "Linked List",
    category: "datastructure",
    language: "python",
    code: `# Linked List — insert and traverse
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert(self, data):
        node = Node(data)
        node.next = self.head
        self.head = node

    def traverse(self):
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return result

ll = LinkedList()
ll.insert(30)
ll.insert(20)
ll.insert(10)
print("List:", ll.traverse())`
  },
  {
    id: "py-star-pattern",
    name: "Star Pattern",
    category: "pattern",
    language: "python",
    code: `# Right-angled triangle star pattern
rows = 5
for i in range(1, rows + 1):
    line = ""
    for j in range(1, i + 1):
        line += "* "
    print(line)`
  },
  {
    id: "py-insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    language: "python",
    code: `# Insertion Sort — O(n²) time, O(1) space
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

nums = [12, 11, 13, 5, 6]
print("Sorted:", insertion_sort(nums))`
  },
  {
    id: "py-merge-sort",
    name: "Merge Sort",
    category: "sorting",
    language: "python",
    code: `# Merge Sort — O(n log n) time, O(n) space
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

nums = [38, 27, 43, 3, 9, 82, 10]
print("Sorted:", merge_sort(nums))`
  },
  {
    id: "py-quick-sort",
    name: "Quick Sort",
    category: "sorting",
    language: "python",
    code: `# Quick Sort — O(n log n) avg, O(n²) worst
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x <= pivot]
    right = [x for x in arr[:-1] if x > pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)

nums = [10, 7, 8, 9, 1, 5]
print("Sorted:", quick_sort(nums))`
  },
  {
    id: "py-queue",
    name: "Queue (FIFO)",
    category: "datastructure",
    language: "python",
    code: `# Queue — First In, First Out
from collections import deque

q = deque()
q.append(10)
print("Enqueued: 10")
q.append(20)
print("Enqueued: 20")
q.append(30)
print("Enqueued: 30")

item = q.popleft()
print("Dequeued:", item)
item = q.popleft()
print("Dequeued:", item)
print("Front:", q[0])`
  },
  {
    id: "py-bfs",
    name: "BFS (Graph)",
    category: "graph",
    language: "python",
    code: `# Breadth-First Search
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        print("Visiting:", node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
}

print("BFS order:", bfs(graph, "A"))`
  },
  {
    id: "py-dfs",
    name: "DFS (Graph)",
    category: "graph",
    language: "python",
    code: `# Depth-First Search
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    print("Visiting:", start)

    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return list(visited)

graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
}

print("DFS order:", dfs(graph, "A"))`
  },
];

// ─── Java Snippets ───
export const JAVA_SNIPPETS: AlgorithmSnippet[] = [
  {
    id: "java-bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    language: "java",
    code: `public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.print("Sorted: ");
        for (int num : arr) System.out.print(num + " ");
    }
}`
  },
  {
    id: "java-binary-search",
    name: "Binary Search",
    category: "searching",
    language: "java",
    code: `public class Main {
    static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        int index = binarySearch(arr, target);
        System.out.println("Found " + target + " at index: " + index);
    }
}`
  },
  {
    id: "java-fibonacci",
    name: "Fibonacci (Recursion)",
    category: "recursion",
    language: "java",
    code: `public class Main {
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        int n = 6;
        System.out.println("fibonacci(" + n + ") = " + fibonacci(n));
    }
}`
  },
];

// ─── C++ Snippets ───
export const CPP_SNIPPETS: AlgorithmSnippet[] = [
  {
    id: "cpp-bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    language: "cpp",
    code: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    cout << "Sorted: ";
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`
  },
  {
    id: "cpp-binary-search",
    name: "Binary Search",
    category: "searching",
    language: "cpp",
    code: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 23;
    int index = binarySearch(arr, n, target);
    cout << "Found " << target << " at index: " << index << endl;
    return 0;
}`
  },
  {
    id: "cpp-fibonacci",
    name: "Fibonacci (Recursion)",
    category: "recursion",
    language: "cpp",
    code: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int n = 6;
    cout << "fibonacci(" << n << ") = " << fibonacci(n) << endl;
    return 0;
}`
  },
];

// ─── SQL Snippets ───
export const SQL_SNIPPETS: AlgorithmSnippet[] = [
  {
    id: "sql-basics",
    name: "Create & Query",
    category: "datastructure",
    language: "sql",
    code: `CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER);
INSERT INTO students VALUES (1, 'Alice', 85);
INSERT INTO students VALUES (2, 'Bob', 92);
INSERT INTO students VALUES (3, 'Charlie', 78);
INSERT INTO students VALUES (4, 'Diana', 95);
SELECT * FROM students WHERE grade > 80 ORDER BY grade DESC;`
  },
  {
    id: "sql-join",
    name: "JOIN Query",
    category: "datastructure",
    language: "sql",
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, product TEXT, total INTEGER, FOREIGN KEY(user_id) REFERENCES users(id));
INSERT INTO users VALUES (1, 'Alice');
INSERT INTO users VALUES (2, 'Bob');
INSERT INTO orders VALUES (101, 1, 'Laptop', 50000);
INSERT INTO orders VALUES (102, 1, 'Mouse', 500);
INSERT INTO orders VALUES (103, 2, 'Keyboard', 1500);
SELECT users.name, orders.product, orders.total FROM users JOIN orders ON users.id = orders.user_id;`
  },
];

// ─── Aggregate all snippets by language ───
export const ALL_SNIPPETS: Record<string, AlgorithmSnippet[]> = {
  javascript: JS_SNIPPETS,
  python: PYTHON_SNIPPETS,
  java: JAVA_SNIPPETS,
  cpp: CPP_SNIPPETS,
  sql: SQL_SNIPPETS,
};

export const CATEGORY_LABELS: Record<string, string> = {
  sorting: "🔄 Sorting",
  searching: "🔍 Searching",
  datastructure: "📦 Data Structures",
  graph: "🕸️ Graphs",
  recursion: "🔁 Recursion",
  pattern: "⭐ Patterns",
};
