// Curated algorithm snippet library — ready-to-run examples for each category
// These power the "Examples" dropdown in the UI

export interface AlgorithmSnippet {
  id: string;
  name: string;
  category: "sorting" | "searching" | "datastructure" | "graph" | "recursion" | "pattern";
  language: string;
  code: string;
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
console.log("Sorted:", sorted);`
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

const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const target = 23;
const index = binarySearch(sorted, target);
console.log("Found", target, "at index:", index);`
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
