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

1. [Arrays & Two Pointers](#1-arrays-two-pointers)
2. [Hashing / HashMap Patterns](#2-hashing-hashmap-patterns)
3. [Linked Lists](#3-linked-lists)
4. [Stacks & Queues](#4-stacks-queues)
5. [Recursion Fundamentals](#5-recursion-fundamentals)
6. [Sorting Algorithms](#6-sorting-algorithms)
7. [Searching Algorithms](#7-searching-algorithms)
8. [Math & Number Theory](#8-math-number-theory)
9. [Bit Manipulation](#9-bit-manipulation)
10. [String Algorithms](#10-string-algorithms)
11. [Heaps (Priority Queues)](#11-heaps-priority-queues)
12. [Trees](#12-trees)
13. [Graph Algorithms](#13-graph-algorithms)
14. [Greedy Algorithms](#14-greedy-algorithms)
15. [Backtracking](#15-backtracking)
16. [Dynamic Programming](#16-dynamic-programming)

**Part 2 — MongoDB**

17. [MongoDB: CRUD & Query Basics](#17-mongodb-crud-query-basics)
18. [MongoDB: Aggregation Pipeline](#18-mongodb-aggregation-pipeline)
19. [MongoDB: Indexing](#19-mongodb-indexing)
20. [MongoDB: Schema Design Patterns](#20-mongodb-schema-design-patterns)
21. [MongoDB: Transactions & Bulk Ops](#21-mongodb-transactions-bulk-ops)

**Part 3 — MySQL**

22. [MySQL: Joins & Basics](#22-mysql-joins-basics)
23. [MySQL: Subqueries & Aggregation](#23-mysql-subqueries-aggregation)
24. [MySQL: Window Functions](#24-mysql-window-functions)
25. [MySQL: Indexing & Optimization](#25-mysql-indexing-optimization)
26. [MySQL: Stored Procedures & Triggers](#26-mysql-stored-procedures-triggers)

**Part 4 — PostgreSQL**

27. [PostgreSQL: Joins](#27-postgresql-joins)
28. [PostgreSQL: Subqueries & CTEs](#28-postgresql-subqueries-ctes)
29. [PostgreSQL: Window Functions](#29-postgresql-window-functions)
30. [PostgreSQL: Indexing](#30-postgresql-indexing)
31. [PostgreSQL: Common Patterns](#31-postgresql-common-patterns)
32. [PostgreSQL: Transactions & EXPLAIN](#32-postgresql-transactions-explain)

**Part 5 — Redis**

33. [Redis: Core Data Structures](#33-redis-core-data-structures)
34. [Redis: Caching Patterns](#34-redis-caching-patterns)

**Part 6 — Python**

35. [Generators & Iterators](#35-generators-iterators)
36. [Decorators & Context Managers](#36-decorators-context-managers)
37. [List Comprehensions & Functional Patterns](#37-list-comprehensions-functional-patterns)
38. [Python Concurrency (GIL, Threading, Async)](#38-python-concurrency-gil-threading-async)

**Part 7 — JavaScript**

39. [Closures & Scope](#39-closures-scope)
40. [Event Loop & Concurrency](#40-event-loop-concurrency)
41. [Hoisting (var vs let)](#41-hoisting-var-vs-let)
42. [Call, Apply, and Bind](#42-call-apply-and-bind)
43. [Promises & Async/Await](#43-promises-asyncawait)
44. [Prototypal Inheritance & Classes](#44-prototypal-inheritance-classes)

**Part 8 — TypeScript**

45. [TypeScript: Types & Interfaces](#45-typescript-types-interfaces)
46. [TypeScript: Advanced Patterns](#46-typescript-advanced-patterns)

**Part 9 — C++**

47. [STL Basics (Vectors, Maps, Sets)](#47-stl-basics-vectors-maps-sets)
48. [Pointers & References](#48-pointers-references)
49. [Memory Management (Heap vs Stack)](#49-memory-management-heap-vs-stack)

**Part 10 — Java**

50. [OOPs (Inheritance, Polymorphism)](#50-oops-inheritance-polymorphism)
51. [Collections Framework](#51-collections-framework)
52. [Garbage Collection Basics](#52-garbage-collection-basics)

---


# Part 1 — Data Structures & Algorithms

All code below is Java, dependency-free, and can be run as-is.

## 1. Arrays & Two Pointers

### Kadane's Algorithm (Maximum Subarray Sum)
**Time:** O(n) · **Space:** O(1)

```java
public class Kadane {
    public static int maxSubarraySum(int[] arr) {
        int maxSoFar = Integer.MIN_VALUE;
        int currentMax = 0;

        for (int x : arr) {
            currentMax = Math.max(x, currentMax + x);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}
```

### Sliding Window Template (Variable Size)
**Time:** O(n) · **Space:** O(1)

```java
public class SlidingWindow {
    public static int slidingWindow(int[] arr, int threshold) {
        int left = 0, bestAns = 0, currentState = 0;

        for (int right = 0; right < arr.length; right++) {
            currentState += arr[right];

            while (left <= right && currentState > threshold) {
                currentState -= arr[left];
                left++;
            }
            bestAns = Math.max(bestAns, right - left + 1);
        }
        return bestAns;
    }
}
```

### Two Pointers Technique
**Time:** O(n) · **Space:** O(1)

```java
public class TwoPointers {
    public static int[] twoSumSorted(int[] arr, int target) {
        int left = 0, right = arr.length - 1;

        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return new int[]{left, right};
            else if (sum < target) left++;
            else right--;
        }
        return null;
    }
}
```

## 2. Hashing / HashMap Patterns

### Two Sum (Classic HashMap)
**Time:** O(n) · **Space:** O(n)

```java
import java.util.*;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement))
                return new int[]{map.get(complement), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

### Group Anagrams
**Time:** O(n × k log k) · **Space:** O(n × k)

```java
import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] arr = s.toCharArray();
            Arrays.sort(arr);
            String key = new String(arr);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}
```

### Subarray Sum Equals K
**Time:** O(n) · **Space:** O(n)

```java
import java.util.*;

public class SubarraySumK {
    public static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0, 1);
        int sum = 0, count = 0;

        for (int num : nums) {
            sum += num;
            count += prefixCount.getOrDefault(sum - k, 0);
            prefixCount.merge(sum, 1, Integer::sum);
        }
        return count;
    }
}
```

### Longest Substring Without Repeating Characters
**Time:** O(n) · **Space:** O(min(n, m))

```java
import java.util.*;

public class LongestSubstringNoRepeat {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c))
                left = Math.max(left, map.get(c) + 1);
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
```

## 3. Linked Lists

### Reverse a Linked List
**Time:** O(n) · **Space:** O(1)

```java
public class ReverseLinkedList {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public static ListNode reverse(ListNode head) {
        ListNode prev = null, curr = head;

        while (curr != null) {
            ListNode nxt = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
}
```

### Floyd's Cycle Detection (Tortoise and Hare)
**Time:** O(n) · **Space:** O(1)

```java
public class FloydCycle {
    public static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
```

## 4. Stacks & Queues

### Valid Parentheses
**Time:** O(n) · **Space:** O(n)

```java
import java.util.*;

public class ValidParentheses {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> map = Map.of(')', '(', '}', '{', ']', '[');

        for (char c : s.toCharArray()) {
            if (map.containsKey(c)) {
                char top = stack.isEmpty() ? '#' : stack.pop();
                if (map.get(c) != top) return false;
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }
}
```

### Next Greater Element
**Time:** O(n) · **Space:** O(n)

```java
import java.util.*;

public class NextGreater {
    public static int[] nextGreaterElement(int[] nums) {
        int[] res = new int[nums.length];
        Arrays.fill(res, -1);
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < nums.length; i++) {
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                res[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        return res;
    }
}
```

## 5. Recursion Fundamentals

### Tower of Hanoi
**Time:** O(2^n) · **Space:** O(n)

```java
public class TowerOfHanoi {
    public static void solve(int n, char from, char to, char aux) {
        if (n == 0) return;
        solve(n - 1, from, aux, to);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        solve(n - 1, aux, to, from);
    }
}
```

### Print All Paths in a Grid (Top-Left to Bottom-Right)
**Time:** O(2^(m+n)) · **Space:** O(m + n)

```java
import java.util.*;

public class GridPaths {
    public static List<String> allPaths(int m, int n) {
        List<String> result = new ArrayList<>();
        dfs(0, 0, m, n, "", result);
        return result;
    }

    private static void dfs(int r, int c, int m, int n, String path, List<String> result) {
        if (r == m - 1 && c == n - 1) { result.add(path); return; }
        if (r < m - 1) dfs(r + 1, c, m, n, path + "D", result);
        if (c < n - 1) dfs(r, c + 1, m, n, path + "R", result);
    }
}
```

### Generate All Balanced Parentheses
**Time:** O(4^n / sqrt(n)) · **Space:** O(n)

```java
import java.util.*;

public class GenerateParentheses {
    public static List<String> generate(int n) {
        List<String> result = new ArrayList<>();
        backtrack("", 0, 0, n, result);
        return result;
    }

    private static void backtrack(String current, int open, int close, int n, List<String> result) {
        if (current.length() == 2 * n) { result.add(current); return; }
        if (open < n) backtrack(current + "(", open + 1, close, n, result);
        if (close < open) backtrack(current + ")", open, close + 1, n, result);
    }
}
```

## 6. Sorting Algorithms

### Bubble Sort
**Time:** O(n²) · **Space:** O(1) · Stable

```java
public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}
```

### Selection Sort
**Time:** O(n²) · **Space:** O(1) · Not stable

```java
public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}
```

### Insertion Sort
**Time:** O(n²) · **Space:** O(1) · Stable

```java
public class InsertionSort {
    public static void sort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i], j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}
```

### Merge Sort
**Time:** O(n log n) · **Space:** O(n) · Stable

```java
public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1, n2 = r - m;
        int[] L = new int[n1], R = new int[n2];

        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);

        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2)
            arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
}
```

### Quick Sort
**Time:** O(n log n) avg, O(n²) worst · **Space:** O(log n) · Not stable

```java
public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high], i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}
```

### Heap Sort
**Time:** O(n log n) · **Space:** O(1) · Not stable

```java
public class HeapSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }
}
```

### Counting Sort
**Time:** O(n + k) · **Space:** O(k)

```java
public class CountingSort {
    public static int[] sort(int[] arr) {
        int max = Arrays.stream(arr).max().orElse(0);
        int[] count = new int[max + 1];
        int[] output = new int[arr.length];

        for (int x : arr) count[x]++;
        for (int i = 1; i <= max; i++) count[i] += count[i - 1];
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }
        return output;
    }
}
```

### Radix Sort
**Time:** O(d × (n + k)) · **Space:** O(n + k)

```java
public class RadixSort {
    public static void sort(int[] arr) {
        int max = Arrays.stream(arr).max().orElse(0);
        for (int exp = 1; max / exp > 0; exp *= 10)
            countingSortByDigit(arr, exp);
    }

    private static void countingSortByDigit(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count = new int[10];

        for (int x : arr) count[(x / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }
        System.arraycopy(output, 0, arr, 0, n);
    }
}
```

## 7. Searching Algorithms

### Linear Search
**Time:** O(n) · **Space:** O(1)

```java
public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++)
            if (arr[i] == target) return i;
        return -1;
    }
}
```

### Binary Search (Iterative)
**Time:** O(log n) · **Space:** O(1)

```java
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}
```

### Binary Search (Recursive)
**Time:** O(log n) · **Space:** O(log n)

```java
public class BinarySearchRecursive {
    public static int search(int[] arr, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) return search(arr, target, mid + 1, hi);
        else return search(arr, target, lo, mid - 1);
    }
}
```

### Binary Search on Answer (Template)
**Time:** O(log(search_space) × check) · **Space:** O(1)

```java
public class BinarySearchOnAnswer {
    public static int searchOnAnswer(int lo, int hi) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (isFeasible(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private static boolean isFeasible(int mid) {
        // Define your feasibility check here
        return true;
    }
}
```

## 8. Math & Number Theory

### Sieve of Eratosthenes
**Time:** O(n log log n) · **Space:** O(n)

```java
import java.util.*;

public class Sieve {
    public static List<Integer> sieve(int n) {
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;

        for (int p = 2; p * p <= n; p++) {
            if (isPrime[p]) {
                for (int i = p * p; i <= n; i += p)
                    isPrime[i] = false;
            }
        }

        List<Integer> primes = new ArrayList<>();
        for (int p = 2; p <= n; p++)
            if (isPrime[p]) primes.add(p);
        return primes;
    }
}
```

### Euclidean Algorithm (GCD)
**Time:** O(log(min(a, b))) · **Space:** O(1)

```java
public class GCD {
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

### Fast / Modular Exponentiation
**Time:** O(log b) · **Space:** O(1)

```java
public class FastPow {
    public static long fastPow(long a, long b, long m) {
        long res = 1;
        a = a % m;

        while (b > 0) {
            if ((b & 1) == 1)
                res = (res * a) % m;
            b >>= 1;
            a = (a * a) % m;
        }
        return res;
    }
}
```

## 9. Bit Manipulation

### Common Bit Tricks

```java
public class BitTricks {
    public static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static int countSetBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }

    public static int getIthBit(int n, int i) {
        return (n >> i) & 1;
    }

    public static int setIthBit(int n, int i) {
        return n | (1 << i);
    }

    public static int clearIthBit(int n, int i) {
        return n & ~(1 << i);
    }

    public static int toggleIthBit(int n, int i) {
        return n ^ (1 << i);
    }

    public static boolean isOdd(int n) {
        return (n & 1) == 1;
    }

    public static void swap(int a, int b) {
        a ^= b;
        b ^= a;
        a ^= b;
    }
}
```

## 10. String Algorithms

### KMP (Knuth-Morris-Pratt) Pattern Matching
**Time:** O(n + m) · **Space:** O(m)

```java
public class KMP {
    public static int[] buildLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0, i = 1;

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                lps[i++] = ++len;
            } else if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
        return lps;
    }

    public static int search(String text, String pattern) {
        int[] lps = buildLPS(pattern);
        int i = 0, j = 0;

        while (i < text.length()) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++; j++;
            }
            if (j == pattern.length()) return i - j;
            else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0) j = lps[j - 1];
                else i++;
            }
        }
        return -1;
    }
}
```

### Rabin-Karp Pattern Matching (Rolling Hash)
**Time:** O(n + m) avg · **Space:** O(1)

```java
public class RabinKarp {
    static final int MOD = 1_000_000_007;
    static final int BASE = 31;

    public static int search(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        if (m > n) return -1;

        long patHash = 0, txtHash = 0, power = 1;
        for (int i = 0; i < m; i++) {
            patHash = (patHash + (pattern.charAt(i) - 'a' + 1) * power) % MOD;
            txtHash = (txtHash + (text.charAt(i) - 'a' + 1) * power) % MOD;
            if (i < m - 1) power = (power * BASE) % MOD;
        }

        for (int i = 0; i <= n - m; i++) {
            if (patHash == txtHash && text.substring(i, i + m).equals(pattern))
                return i;
            if (i < n - m) {
                txtHash = (txtHash - (text.charAt(i) - 'a' + 1)) % MOD;
                txtHash = (txtHash / BASE + (text.charAt(i + m) - 'a' + 1) * power) % MOD;
                txtHash = (txtHash + MOD) % MOD;
            }
        }
        return -1;
    }
}
```

### Z-Algorithm (Pattern Matching)
**Time:** O(n + m) · **Space:** O(n + m)

```java
public class ZAlgorithm {
    public static int[] zFunction(String s) {
        int n = s.length();
        int[] z = new int[n];
        int l = 0, r = 0;

        for (int i = 1; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] > r) { l = i; r = i + z[i]; }
        }
        return z;
    }
}
```

### Longest Palindromic Substring (Expand Around Center)
**Time:** O(n²) · **Space:** O(1)

```java
public class LongestPalindrome {
    static int start = 0, maxLen = 0;

    public static String longestPalindrome(String s) {
        if (s.length() < 2) return s;
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return s.substring(start, start + maxLen);
    }

    private static void expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--; right++;
        }
        if (right - left - 1 > maxLen) {
            start = left + 1;
            maxLen = right - left - 1;
        }
    }
}
```

## 11. Heaps (Priority Queues)

### Top K Frequent Elements
**Time:** O(n log k) · **Space:** O(n)

```java
import java.util.*;

public class TopKFrequent {
    public static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.merge(n, 1, Integer::sum);

        PriorityQueue<Integer> heap = new PriorityQueue<>(
            Comparator.comparingInt(count::get)
        );

        for (int key : count.keySet()) {
            heap.offer(key);
            if (heap.size() > k) heap.poll();
        }

        int[] res = new int[k];
        for (int i = 0; i < k; i++) res[i] = heap.poll();
        return res;
    }
}
```

### Kth Largest Element
**Time:** O(n log k) · **Space:** O(k)

```java
import java.util.*;

public class KthLargest {
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int n : nums) {
            minHeap.offer(n);
            if (minHeap.size() > k) minHeap.poll();
        }
        return minHeap.peek();
    }
}
```

## 12. Trees

### Binary Tree Node & Traversals

```java
import java.util.*;

public class TreeTraversals {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static List<Integer> inorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        res.addAll(inorder(root.left));
        res.add(root.val);
        res.addAll(inorder(root.right));
        return res;
    }

    public static List<Integer> preorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        res.add(root.val);
        res.addAll(preorder(root.left));
        res.addAll(preorder(root.right));
        return res;
    }

    public static List<Integer> postorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        res.addAll(postorder(root.left));
        res.addAll(postorder(root.right));
        res.add(root.val);
        return res;
    }

    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}
```

### Binary Search Tree — Insert, Search, Delete

```java
public class BST {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static TreeNode insert(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insert(root.left, val);
        else root.right = insert(root.right, val);
        return root;
    }

    public static TreeNode search(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        return val < root.val ? search(root.left, val) : search(root.right, val);
    }

    public static TreeNode delete(TreeNode root, int val) {
        if (root == null) return null;
        if (val < root.val) root.left = delete(root.left, val);
        else if (val > root.val) root.right = delete(root.right, val);
        else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode succ = root.right;
            while (succ.left != null) succ = succ.left;
            root.val = succ.val;
            root.right = delete(root.right, succ.val);
        }
        return root;
    }
}
```

### Trie (Prefix Tree)

```java
public class Trie {
    private final Trie[] children = new Trie[26];
    private boolean isEnd = false;

    public void insert(String word) {
        Trie node = this;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null)
                node.children[idx] = new Trie();
            node = node.children[idx];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        Trie node = searchPrefix(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }

    private Trie searchPrefix(String word) {
        Trie node = this;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return null;
            node = node.children[idx];
        }
        return node;
    }
}
```

### Segment Tree (Range Sum Query + Point Update)

```java
public class SegmentTree {
    int[] tree;
    int n;

    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 1, 0, n - 1);
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = (start + end) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public void update(int idx, int val, int node, int start, int end) {
        if (start == end) { tree[node] = val; return; }
        int mid = (start + end) / 2;
        if (idx <= mid) update(idx, val, 2 * node, start, mid);
        else update(idx, val, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public int query(int l, int r, int node, int start, int end) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(l, r, 2 * node, start, mid) + query(l, r, 2 * node + 1, mid + 1, end);
    }
}
```

### Fenwick Tree / Binary Indexed Tree (Prefix Sums)

```java
public class FenwickTree {
    int[] bit;
    int n;

    public FenwickTree(int n) {
        this.n = n;
        bit = new int[n + 1];
    }

    public void update(int i, int delta) {
        for (i++; i <= n; i += i & (-i))
            bit[i] += delta;
    }

    public int query(int i) {
        int sum = 0;
        for (i++; i > 0; i -= i & (-i))
            sum += bit[i];
        return sum;
    }

    public int rangeQuery(int l, int r) {
        return query(r) - (l > 0 ? query(l - 1) : 0);
    }
}
```

### Lowest Common Ancestor (LCA) — Binary Lifting
**Time:** O(n log n) build, O(log n) query · **Space:** O(n log n)

```java
import java.util.*;

public class LCA {
    int[][] up;
    int[] depth;
    int LOG;

    public LCA(List<List<Integer>> adj, int root) {
        int n = adj.size();
        LOG = (int)(Math.log(n) / Math.log(2)) + 1;
        up = new int[n][LOG];
        depth = new int[n];

        Queue<Integer> queue = new LinkedList<>();
        boolean[] visited = new boolean[n];
        queue.offer(root);
        visited[root] = true;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    depth[v] = depth[u] + 1;
                    up[v][0] = u;
                    for (int k = 1; k < LOG; k++)
                        up[v][k] = up[up[v][k - 1]][k - 1];
                    queue.offer(v);
                }
            }
        }
    }

    public int lca(int u, int v) {
        if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
        int diff = depth[u] - depth[v];
        for (int k = 0; k < LOG; k++)
            if (((diff >> k) & 1) == 1) u = up[u][k];
        if (u == v) return u;
        for (int k = LOG - 1; k >= 0; k--)
            if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
        return up[u][0];
    }
}
```

## 13. Graph Algorithms

### Graph Representation (Adjacency List)

```java
import java.util.*;

public class Graph {
    int V;
    List<List<int[]>> adj; // int[] = {neighbor, weight}

    public Graph(int V) {
        this.V = V;
        adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
    }

    public void addEdge(int u, int v, int w) {
        adj.get(u).add(new int[]{v, w});
        adj.get(v).add(new int[]{u, w}); // undirected
    }
}
```

### Breadth-First Search (BFS)
**Time:** O(V + E) · **Space:** O(V)

```java
import java.util.*;

public class BFS {
    public static List<Integer> bfs(List<List<Integer>> adj, int start) {
        List<Integer> order = new ArrayList<>();
        boolean[] visited = new boolean[adj.size()];
        Queue<Integer> queue = new LinkedList<>();

        visited[start] = true;
        queue.offer(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int neighbor : adj.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        return order;
    }
}
```

### Depth-First Search (DFS) — Recursive & Iterative
**Time:** O(V + E) · **Space:** O(V)

```java
import java.util.*;

public class DFS {
    public static void dfsRecursive(List<List<Integer>> adj, int node, boolean[] visited, List<Integer> order) {
        visited[node] = true;
        order.add(node);
        for (int neighbor : adj.get(node))
            if (!visited[neighbor])
                dfsRecursive(adj, neighbor, visited, order);
    }

    public static List<Integer> dfsIterative(List<List<Integer>> adj, int start) {
        List<Integer> order = new ArrayList<>();
        boolean[] visited = new boolean[adj.size()];
        Stack<Integer> stack = new Stack<>();

        stack.push(start);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (visited[node]) continue;
            visited[node] = true;
            order.add(node);
            for (int neighbor : adj.get(node))
                if (!visited[neighbor])
                    stack.push(neighbor);
        }
        return order;
    }
}
```

### Dijkstra's Algorithm (Shortest Path, Non-negative Weights)
**Time:** O((V + E) log V) · **Space:** O(V)

```java
import java.util.*;

public class Dijkstra {
    public static int[] dijkstra(List<List<int[]>> adj, int src) {
        int V = adj.size();
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.offer(new int[]{src, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], d = curr[1];
            if (d > dist[u]) continue;

            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{v, dist[v]});
                }
            }
        }
        return dist;
    }
}
```

### Bellman-Ford Algorithm (Handles Negative Weights)
**Time:** O(V × E) · **Space:** O(V)

```java
import java.util.*;

public class BellmanFord {
    public static int[] bellmanFord(int V, int[][] edges, int src) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        for (int i = 0; i < V - 1; i++) {
            for (int[] e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v])
                    dist[v] = dist[u] + w;
            }
        }

        // Detect negative cycle
        for (int[] e : edges)
            if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]])
                throw new RuntimeException("Negative cycle detected");

        return dist;
    }
}
```

### Floyd-Warshall Algorithm (All-Pairs Shortest Paths)
**Time:** O(V³) · **Space:** O(V²)

```java
public class FloydWarshall {
    public static int[][] floydWarshall(int[][] graph) {
        int V = graph.length;
        int[][] dist = new int[V][V];
        for (int i = 0; i < V; i++)
            System.arraycopy(graph[i], 0, dist[i], 0, V);

        for (int k = 0; k < V; k++)
            for (int i = 0; i < V; i++)
                for (int j = 0; j < V; j++)
                    if (dist[i][k] != Integer.MAX_VALUE && dist[k][j] != Integer.MAX_VALUE)
                        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        return dist;
    }
}
```

### Topological Sort — Kahn's Algorithm (BFS-based)
**Time:** O(V + E) · **Space:** O(V)

```java
import java.util.*;

public class TopologicalSort {
    public static List<Integer> kahns(List<List<Integer>> adj, int V) {
        int[] inDegree = new int[V];
        for (List<Integer> neighbors : adj)
            for (int v : neighbors) inDegree[v]++;

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < V; i++)
            if (inDegree[i] == 0) queue.offer(i);

        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order.add(u);
            for (int v : adj.get(u))
                if (--inDegree[v] == 0) queue.offer(v);
        }

        if (order.size() != V) throw new RuntimeException("Graph has a cycle");
        return order;
    }
}
```

### Union-Find / Disjoint Set (Path Compression + Union by Rank)

```java
public class UnionFind {
    int[] parent, rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    public int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    public boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) { int t = px; px = py; py = t; }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
}
```

### Kruskal's Algorithm (Minimum Spanning Tree)
**Time:** O(E log E) · **Space:** O(V)

```java
import java.util.*;

public class Kruskal {
    public static int kruskal(int V, int[][] edges) {
        Arrays.sort(edges, Comparator.comparingInt(a -> a[2]));
        UnionFind uf = new UnionFind(V);
        int mstWeight = 0, edgesUsed = 0;

        for (int[] e : edges) {
            if (uf.union(e[0], e[1])) {
                mstWeight += e[2];
                if (++edgesUsed == V - 1) break;
            }
        }
        return mstWeight;
    }
}
```

### Prim's Algorithm (Minimum Spanning Tree)
**Time:** O((V + E) log V) · **Space:** O(V)

```java
import java.util.*;

public class Prim {
    public static int prim(List<List<int[]>> adj) {
        int V = adj.size();
        boolean[] inMST = new boolean[V];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.offer(new int[]{0, 0});
        int totalWeight = 0;

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], w = curr[1];
            if (inMST[u]) continue;
            inMST[u] = true;
            totalWeight += w;

            for (int[] edge : adj.get(u))
                if (!inMST[edge[0]])
                    pq.offer(new int[]{edge[0], edge[1]});
        }
        return totalWeight;
    }
}
```

### Cycle Detection — Directed Graph (DFS)

```java
import java.util.*;

public class CycleDetection {
    public static boolean hasCycleDirected(List<List<Integer>> adj, int V) {
        int[] color = new int[V]; // 0=white, 1=gray, 2=black

        for (int i = 0; i < V; i++)
            if (color[i] == 0 && dfs(adj, i, color)) return true;
        return false;
    }

    private static boolean dfs(List<List<Integer>> adj, int u, int[] color) {
        color[u] = 1;
        for (int v : adj.get(u)) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && dfs(adj, v, color)) return true;
        }
        color[u] = 2;
        return false;
    }
}
```


### Tarjan's Algorithm (Strongly Connected Components)
**Time:** O(V + E) · **Space:** O(V)

```java
import java.util.*;

public class TarjanSCC {
    static int timer = 0;

    public static List<List<Integer>> findSCCs(List<List<Integer>> adj) {
        int n = adj.size();
        int[] disc = new int[n], low = new int[n];
        boolean[] onStack = new boolean[n];
        Arrays.fill(disc, -1);
        Stack<Integer> stack = new Stack<>();
        List<List<Integer>> sccs = new ArrayList<>();

        for (int i = 0; i < n; i++)
            if (disc[i] == -1) dfs(i, adj, disc, low, onStack, stack, sccs);
        return sccs;
    }

    private static void dfs(int u, List<List<Integer>> adj, int[] disc, int[] low,
                            boolean[] onStack, Stack<Integer> stack, List<List<Integer>> sccs) {
        disc[u] = low[u] = timer++;
        stack.push(u);
        onStack[u] = true;

        for (int v : adj.get(u)) {
            if (disc[v] == -1) {
                dfs(v, adj, disc, low, onStack, stack, sccs);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }

        if (low[u] == disc[u]) {
            List<Integer> scc = new ArrayList<>();
            while (true) {
                int v = stack.pop();
                onStack[v] = false;
                scc.add(v);
                if (v == u) break;
            }
            sccs.add(scc);
        }
    }
}
```

## 14. Greedy Algorithms

### Activity Selection (Maximum Non-overlapping Intervals)

```java
import java.util.*;

public class ActivitySelection {
    public static List<int[]> select(int[][] activities) {
        Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));
        List<int[]> selected = new ArrayList<>();
        int lastEnd = Integer.MIN_VALUE;

        for (int[] act : activities) {
            if (act[0] >= lastEnd) {
                selected.add(act);
                lastEnd = act[1];
            }
        }
        return selected;
    }
}
```

### Huffman Coding (Optimal Prefix-free Encoding)

```java
import java.util.*;

public class HuffmanCoding {
    static class HuffmanNode implements Comparable<HuffmanNode> {
        char ch;
        int freq;
        HuffmanNode left, right;

        HuffmanNode(char ch, int freq) { this.ch = ch; this.freq = freq; }
        HuffmanNode(int freq, HuffmanNode l, HuffmanNode r) {
            this.freq = freq; left = l; right = r;
        }

        public int compareTo(HuffmanNode o) { return this.freq - o.freq; }
    }

    public static Map<Character, String> buildCodes(Map<Character, Integer> freqMap) {
        PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();
        for (var entry : freqMap.entrySet())
            pq.offer(new HuffmanNode(entry.getKey(), entry.getValue()));

        while (pq.size() > 1) {
            HuffmanNode left = pq.poll(), right = pq.poll();
            pq.offer(new HuffmanNode(left.freq + right.freq, left, right));
        }

        Map<Character, String> codes = new HashMap<>();
        buildCodesHelper(pq.poll(), "", codes);
        return codes;
    }

    private static void buildCodesHelper(HuffmanNode node, String code, Map<Character, String> codes) {
        if (node == null) return;
        if (node.left == null && node.right == null) { codes.put(node.ch, code); return; }
        buildCodesHelper(node.left, code + "0", codes);
        buildCodesHelper(node.right, code + "1", codes);
    }
}
```

### Fractional Knapsack
**Time:** O(n log n) · **Space:** O(1)

```java
import java.util.*;

public class FractionalKnapsack {
    public static double maxValue(int[][] items, int capacity) {
        // items[i] = {weight, value}
        Arrays.sort(items, (a, b) -> Double.compare((double) b[1] / b[0], (double) a[1] / a[0]));

        double totalValue = 0;
        for (int[] item : items) {
            if (capacity >= item[0]) {
                totalValue += item[1];
                capacity -= item[0];
            } else {
                totalValue += (double) item[1] / item[0] * capacity;
                break;
            }
        }
        return totalValue;
    }
}
```

## 15. Backtracking

### N-Queens

```java
import java.util.*;

public class NQueens {
    public static List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        backtrack(board, 0, result);
        return result;
    }

    private static void backtrack(char[][] board, int row, List<List<String>> result) {
        if (row == board.length) {
            List<String> snapshot = new ArrayList<>();
            for (char[] r : board) snapshot.add(new String(r));
            result.add(snapshot);
            return;
        }

        for (int col = 0; col < board.length; col++) {
            if (isSafe(board, row, col)) {
                board[row][col] = 'Q';
                backtrack(board, row + 1, result);
                board[row][col] = '.';
            }
        }
    }

    private static boolean isSafe(char[][] board, int row, int col) {
        for (int i = 0; i < row; i++) if (board[i][col] == 'Q') return false;
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] == 'Q') return false;
        for (int i = row - 1, j = col + 1; i >= 0 && j < board.length; i--, j++)
            if (board[i][j] == 'Q') return false;
        return true;
    }
}
```

### Sudoku Solver

```java
public class SudokuSolver {
    public static boolean solve(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(board, r, c, num)) {
                            board[r][c] = num;
                            if (solve(board)) return true;
                            board[r][c] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private static boolean isValid(char[][] board, int row, int col, char num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num) return false;
            if (board[i][col] == num) return false;
            if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == num) return false;
        }
        return true;
    }
}
```

### Permutations

```java
import java.util.*;

public class Permutations {
    public static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);
        return result;
    }

    private static void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> result) {
        if (path.size() == nums.length) { result.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, path, used, result);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

### Subsets (Power Set)

```java
import java.util.*;

public class Subsets {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private static void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

### Combinations (Choose k of n)

```java
import java.util.*;

public class Combinations {
    public static List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(n, k, 1, new ArrayList<>(), result);
        return result;
    }

    private static void backtrack(int n, int k, int start, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == k) { result.add(new ArrayList<>(path)); return; }
        for (int i = start; i <= n; i++) {
            path.add(i);
            backtrack(n, k, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

## 16. Dynamic Programming

### Fibonacci — Memoization & Tabulation
**Time:** O(n) · **Space:** O(n) memo / O(1) tabulation-optimized

```java
import java.util.*;

public class Fibonacci {
    // Memoization
    static Map<Integer, Long> memo = new HashMap<>();
    public static long fibMemo(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long val = fibMemo(n - 1) + fibMemo(n - 2);
        memo.put(n, val);
        return val;
    }

    // Tabulation (O(1) space)
    public static long fibTab(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
```

### 0/1 Knapsack
**Time:** O(n × W) · **Space:** O(n × W)

```java
public class Knapsack01 {
    public static int knapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                dp[i][w] = dp[i - 1][w];
                if (weights[i - 1] <= w)
                    dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        }
        return dp[n][W];
    }
}
```

### Coin Change — Minimum Coins (Unbounded Knapsack Variant)
**Time:** O(n × amount) · **Space:** O(amount)

```java
import java.util.*;

public class CoinChange {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++)
            for (int c : coins)
                if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);

        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

### Coin Change — Count Ways

```java
public class CoinChangeWays {
    public static int countWays(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;

        for (int c : coins)
            for (int i = c; i <= amount; i++)
                dp[i] += dp[i - c];

        return dp[amount];
    }
}
```

### Longest Common Subsequence (LCS)
**Time:** O(m × n) · **Space:** O(m × n)

```java
public class LCS {
    public static int lcs(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1] + 1
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);

        return dp[m][n];
    }
}
```

### Longest Increasing Subsequence (LIS)
**Time:** O(n log n) · **Space:** O(n)

```java
import java.util.*;

public class LIS {
    public static int lis(int[] nums) {
        List<Integer> tails = new ArrayList<>();

        for (int x : nums) {
            int pos = Collections.binarySearch(tails, x);
            if (pos < 0) pos = -(pos + 1);
            if (pos == tails.size()) tails.add(x);
            else tails.set(pos, x);
        }
        return tails.size();
    }
}
```

### Edit Distance (Levenshtein)
**Time:** O(m × n) · **Space:** O(m × n)

```java
public class EditDistance {
    public static int editDistance(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));

        return dp[m][n];
    }
}
```

### Matrix Chain Multiplication
**Time:** O(n³) · **Space:** O(n²)

```java
public class MatrixChainMultiplication {
    public static int mcm(int[] dims) {
        int n = dims.length - 1;
        int[][] dp = new int[n][n];

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++)
                    dp[i][j] = Math.min(dp[i][j],
                        dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]);
            }
        }
        return dp[0][n - 1];
    }
}
```

### Subset Sum
**Time:** O(n × target) · **Space:** O(target)

```java
public class SubsetSum {
    public static boolean canPartition(int[] nums, int target) {
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int num : nums)
            for (int j = target; j >= num; j--)
                dp[j] = dp[j] || dp[j - num];

        return dp[target];
    }
}
```

### House Robber (No Two Adjacent Elements)
**Time:** O(n) · **Space:** O(1)

```java
public class HouseRobber {
    public static int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int num : nums) {
            int curr = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}
```

---


### Longest Palindromic Subsequence
**Time:** O(n²) · **Space:** O(n²)

```java
public class LongestPalindromicSubseq {
    public static int longestPalinSubseq(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];

        for (int i = n - 1; i >= 0; i--) {
            dp[i][i] = 1;
            for (int j = i + 1; j < n; j++) {
                dp[i][j] = s.charAt(i) == s.charAt(j)
                    ? dp[i + 1][j - 1] + 2
                    : Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
        return dp[0][n - 1];
    }
}
```

### Word Break Problem
**Time:** O(n² × m) · **Space:** O(n)

```java
import java.util.*;

public class WordBreak {
    public static boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;

        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
        return dp[s.length()];
    }
}
```

### Minimum Path Sum in Grid
**Time:** O(m × n) · **Space:** O(n)

```java
public class MinPathSum {
    public static int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) dp[j] = grid[0][0];
                else if (i == 0) dp[j] = dp[j - 1] + grid[i][j];
                else if (j == 0) dp[j] = dp[j] + grid[i][j];
                else dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
            }
        }
        return dp[n - 1];
    }
}
```

### Climbing Stairs (Distinct Ways)
**Time:** O(n) · **Space:** O(1)

```java
public class ClimbingStairs {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
```

# Part 2 — MongoDB

## 17. MongoDB: CRUD & Query Basics

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

## 18. MongoDB: Aggregation Pipeline

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

## 19. MongoDB: Indexing

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

## 20. MongoDB: Schema Design Patterns

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

## 21. MongoDB: Transactions & Bulk Ops

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

# Part 3 — MySQL

## 22. MySQL: Joins & Basics

### INNER JOIN
```sql
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
```

### LEFT JOIN (all employees, even without department)
```sql
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
```

### RIGHT JOIN
```sql
SELECT e.name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;
```

### SELF JOIN (employees with their managers)
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

### CROSS JOIN
```sql
SELECT c.color, s.size
FROM colors c
CROSS JOIN sizes s;
```

## 23. MySQL: Subqueries & Aggregation

### Subquery in WHERE
```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### Correlated Subquery (employees earning more than dept avg)
```sql
SELECT e.name, e.salary, e.dept_id
FROM employees e
WHERE e.salary > (
    SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id
);
```

### GROUP BY with HAVING
```sql
SELECT dept_id, COUNT(*) AS cnt, AVG(salary) AS avg_sal
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 5
ORDER BY avg_sal DESC;
```

### CASE expressions
```sql
SELECT name, salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 50000  THEN 'Mid'
        ELSE 'Junior'
    END AS level
FROM employees;
```

## 24. MySQL: Window Functions

### ROW_NUMBER, RANK, DENSE_RANK
```sql
SELECT name, dept_id, salary,
    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS row_num,
    RANK()       OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dense_rnk
FROM employees;
```

### Running Total & Moving Average
```sql
SELECT order_date, amount,
    SUM(amount)   OVER (ORDER BY order_date) AS running_total,
    AVG(amount)   OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_3
FROM orders;
```

### LAG / LEAD (Previous & Next row values)
```sql
SELECT order_date, amount,
    LAG(amount, 1)  OVER (ORDER BY order_date) AS prev_amount,
    LEAD(amount, 1) OVER (ORDER BY order_date) AS next_amount
FROM orders;
```

## 25. MySQL: Indexing & Optimization

### Create Index
```sql
CREATE INDEX idx_employee_name ON employees(name);
CREATE UNIQUE INDEX idx_email ON users(email);
CREATE INDEX idx_composite ON orders(customer_id, order_date);
```

### EXPLAIN Query Plan
```sql
EXPLAIN SELECT * FROM employees WHERE dept_id = 5;
EXPLAIN ANALYZE SELECT * FROM orders WHERE total > 1000;
```

### Query Optimization Tips
```sql
-- Use covering index (all columns in index)
CREATE INDEX idx_cover ON orders(customer_id, order_date, total);
SELECT order_date, total FROM orders WHERE customer_id = 42;

-- Avoid SELECT * in production
SELECT id, name, email FROM users WHERE active = 1;

-- Use LIMIT for pagination
SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 40;
```

## 26. MySQL: Stored Procedures & Triggers

### Stored Procedure
```sql
DELIMITER //
CREATE PROCEDURE GetEmployeesByDept(IN dept INT)
BEGIN
    SELECT name, salary
    FROM employees
    WHERE dept_id = dept
    ORDER BY salary DESC;
END //
DELIMITER ;

-- Call it
CALL GetEmployeesByDept(3);
```

### Trigger (Auto-log salary changes)
```sql
DELIMITER //
CREATE TRIGGER log_salary_change
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    IF OLD.salary != NEW.salary THEN
        INSERT INTO salary_log(employee_id, old_salary, new_salary, changed_at)
        VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
    END IF;
END //
DELIMITER ;
```

### Views
```sql
CREATE VIEW department_summary AS
SELECT d.department_name,
       COUNT(e.id) AS total_employees,
       AVG(e.salary) AS avg_salary,
       MAX(e.salary) AS max_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.dept_id
GROUP BY d.department_name;

-- Use like a table
SELECT * FROM department_summary WHERE total_employees > 10;
```

# Part 4 — PostgreSQL

## 27. PostgreSQL: Joins

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

## 28. PostgreSQL: Subqueries & CTEs

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

## 29. PostgreSQL: Window Functions

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

## 30. PostgreSQL: Indexing

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

## 31. PostgreSQL: Common Patterns

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

## 32. PostgreSQL: Transactions & EXPLAIN

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

---

# Part 5 — Redis

## 33. Redis: Core Data Structures

### Strings (GET / SET / TTL)
```bash
SET user:1:name "Alice"
GET user:1:name                    # "Alice"
SETEX session:abc123 3600 "data"   # Expires in 1 hour
TTL session:abc123                 # Seconds remaining
INCR page:views                    # Atomic counter
INCRBY cart:total 250
```

### Hashes (Object-like storage)
```bash
HSET user:1 name "Alice" age 30 email "alice@example.com"
HGET user:1 name                   # "Alice"
HGETALL user:1                     # All fields
HINCRBY user:1 age 1               # Increment field
HDEL user:1 email                  # Delete a field
```

### Lists (Queues & Stacks)
```bash
LPUSH queue:tasks "task1" "task2"  # Push left (queue)
RPOP queue:tasks                   # Pop right (dequeue)
RPUSH stack:undo "action1"         # Push right (stack)
RPOP stack:undo                    # Pop right (stack pop)
LRANGE queue:tasks 0 -1            # Get all items
LLEN queue:tasks                   # Length
```

### Sets (Unique collections)
```bash
SADD tags:post:1 "java" "dsa" "algorithms"
SMEMBERS tags:post:1               # All members
SISMEMBER tags:post:1 "java"       # Check membership
SINTER tags:post:1 tags:post:2     # Intersection
SUNION tags:post:1 tags:post:2     # Union
SCARD tags:post:1                  # Count
```

### Sorted Sets (Leaderboards)
```bash
ZADD leaderboard 1500 "Alice" 1200 "Bob" 1800 "Charlie"
ZREVRANGE leaderboard 0 2 WITHSCORES   # Top 3
ZSCORE leaderboard "Alice"             # Get score
ZINCRBY leaderboard 100 "Bob"          # Add to score
ZRANK leaderboard "Alice"              # Rank (0-indexed)
```

## 34. Redis: Caching Patterns

### Cache-Aside (Lazy Loading)
```python
import redis
r = redis.Redis()

def get_user(user_id):
    cache_key = f"user:{user_id}"
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)  # Cache HIT

    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    r.setex(cache_key, 3600, json.dumps(user))  # Cache for 1 hour
    return user
```

### Write-Through Cache
```python
def update_user(user_id, data):
    db.execute("UPDATE users SET name=%s WHERE id=%s", data['name'], user_id)
    r.setex(f"user:{user_id}", 3600, json.dumps(data))  # Update cache too
```

### Pub/Sub (Real-time Messaging)
```bash
# Terminal 1 (Subscriber)
SUBSCRIBE notifications

# Terminal 2 (Publisher)
PUBLISH notifications "New order #1234 received"
```

### Rate Limiting (Sliding Window)
```python
def is_rate_limited(user_id, limit=100, window=60):
    key = f"rate:{user_id}"
    current = r.get(key)
    if current and int(current) >= limit:
        return True
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, window)
    pipe.execute()
    return False
```

# Part 6 — Core Language Concepts (Python)

## 35. Generators & Iterators

### Generator Function (Lazy Evaluation)
```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Usage: produces values on demand, no memory waste
fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
```

### Generator Expression vs List Comprehension
```python
# List comprehension — stores ALL in memory
squares_list = [x**2 for x in range(1_000_000)]

# Generator expression — lazy, O(1) memory
squares_gen = (x**2 for x in range(1_000_000))

# Custom iterator class
class CountDown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1
```

## 36. Decorators & Context Managers

### Function Decorator
```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
```

### Decorator with Arguments
```python
def retry(max_attempts=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Retry {attempt + 1}/{max_attempts}")
        return wrapper
    return decorator

@retry(max_attempts=5)
def unreliable_api_call():
    pass
```

### Context Manager
```python
from contextlib import contextmanager

@contextmanager
def managed_resource(name):
    print(f"Acquiring {name}")
    try:
        yield name
    finally:
        print(f"Releasing {name}")

with managed_resource("database") as db:
    print(f"Using {db}")
```

## 37. List Comprehensions & Functional Patterns

### List / Dict / Set Comprehensions
```python
# Filter + transform
evens = [x for x in range(20) if x % 2 == 0]

# Nested comprehension (flatten)
matrix = [[1,2,3], [4,5,6], [7,8,9]]
flat = [x for row in matrix for x in row]

# Dict comprehension
word_lengths = {w: len(w) for w in ["hello", "world", "python"]}

# Set comprehension
unique_lengths = {len(w) for w in ["hi", "hey", "hello", "hi"]}
```

### Map, Filter, Reduce
```python
from functools import reduce

nums = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, nums))
evens   = list(filter(lambda x: x % 2 == 0, nums))
total   = reduce(lambda a, b: a + b, nums)
```

### Unpacking & Zip
```python
# Star unpacking
first, *middle, last = [1, 2, 3, 4, 5]

# Zip (parallel iteration)
names  = ["Alice", "Bob"]
scores = [95, 87]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Dict from two lists
name_score = dict(zip(names, scores))
```

## 38. Python Concurrency (GIL, Threading, Async)

### Threading (I/O-bound tasks)
```python
import threading
import time

def download(url):
    print(f"Downloading {url}...")
    time.sleep(2)
    print(f"Done: {url}")

threads = [threading.Thread(target=download, args=(f"url_{i}",)) for i in range(5)]
for t in threads: t.start()
for t in threads: t.join()
```

### AsyncIO (Modern async/await)
```python
import asyncio

async def fetch_data(name, delay):
    print(f"Fetching {name}...")
    await asyncio.sleep(delay)
    return f"{name} data"

async def main():
    results = await asyncio.gather(
        fetch_data("users", 2),
        fetch_data("posts", 1),
        fetch_data("comments", 3)
    )
    print(results)

asyncio.run(main())
```

### Multiprocessing (CPU-bound tasks — bypasses GIL)
```python
from multiprocessing import Pool

def heavy_computation(n):
    return sum(i * i for i in range(n))

with Pool(4) as pool:
    results = pool.map(heavy_computation, [10**6, 10**6, 10**6, 10**6])
```

# Part 7 — Core Language Concepts (JavaScript)

## 39. Closures & Scope

A **closure** is a function that remembers its outer variables and can access them. In JavaScript, all functions are naturally closures.

```javascript
function makeCounter() {
  let count = 0;
  
  return function() {
    return count++;
  };
}

let counter = makeCounter();
console.log(counter()); // 0
console.log(counter()); // 1
```

## 40. Event Loop & Concurrency

JavaScript has a runtime model based on an **event loop**, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks.

```javascript
console.log('1. Start');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise)');
});

console.log('2. End');

// Output order: 1, 2, 3, 4
```

## 41. Hoisting (var vs let)

**Hoisting** is JavaScript's default behavior of moving declarations to the top.

```javascript
console.log(myVar); // undefined (hoisted, but not initialized)
var myVar = 5;

// console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization
let myLet = 10;

hoistedFunction(); // Works!
function hoistedFunction() {
  console.log('I am hoisted!');
}
```

## 42. Call, Apply, and Bind

Methods to manually set the `this` context for a function.

```javascript
const person = {
  name: 'John'
};

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

// call: comma-separated arguments
greet.call(person, 'Hello', '!'); // Hello, John!

// apply: array of arguments
greet.apply(person, ['Hi', '.']); // Hi, John.

// bind: returns a new function with bound context
const boundGreet = greet.bind(person);
boundGreet('Hey', '?'); // Hey, John?
```

---


## 43. Promises & Async/Await

### Promise Basics
```javascript
function fetchUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) resolve({ id, name: "Alice" });
            else reject(new Error("Invalid ID"));
        }, 1000);
    });
}

fetchUser(1)
    .then(user => console.log(user))
    .catch(err => console.error(err));
```

### Async/Await
```javascript
async function getUser(id) {
    try {
        const user = await fetchUser(id);
        const posts = await fetchPosts(user.id);
        return { user, posts };
    } catch (err) {
        console.error("Failed:", err.message);
    }
}
```

### Promise.all / Promise.race / Promise.allSettled
```javascript
// Run in parallel, fail if ANY fails
const [users, posts] = await Promise.all([
    fetch("/api/users"),
    fetch("/api/posts")
]);

// First to resolve/reject wins
const fastest = await Promise.race([
    fetch("/api/server1"),
    fetch("/api/server2")
]);

// Wait for ALL, never rejects
const results = await Promise.allSettled([
    fetch("/api/a"),
    fetch("/api/b")  // Even if this fails
]);
// results[0].status === "fulfilled" | "rejected"
```

## 44. Prototypal Inheritance & Classes

### Prototype Chain
```javascript
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return `${this.name} makes a sound`;
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
    return `${this.name} barks!`;
};
```

### ES6 Classes (Syntactic Sugar)
```javascript
class Animal {
    constructor(name) { this.name = name; }
    speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    bark() { return `${this.name} barks!`; }
}

const dog = new Dog("Rex", "Labrador");
console.log(dog.speak()); // Inherited
console.log(dog.bark());  // Own method
```

# Part 8 — Core Language Concepts (TypeScript)

## 45. TypeScript: Types & Interfaces

### Basic Types
```typescript
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let scores: number[] = [95, 87, 92];
let tuple: [string, number] = ["Alice", 30];
let anything: any = "could be anything";
let nothing: void = undefined;
```

### Interfaces & Type Aliases
```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;            // Optional
    readonly createdAt: Date; // Immutable
}

type Status = "active" | "inactive" | "banned"; // Union type
type Point = { x: number; y: number };

// Extending interfaces
interface Admin extends User {
    role: "admin" | "superadmin";
    permissions: string[];
}
```

### Generics
```typescript
function identity<T>(arg: T): T {
    return arg;
}

function getFirst<T>(arr: T[]): T | undefined {
    return arr[0];
}

// Generic interface
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// Generic class
class Stack<T> {
    private items: T[] = [];
    push(item: T): void { this.items.push(item); }
    pop(): T | undefined { return this.items.pop(); }
    peek(): T | undefined { return this.items[this.items.length - 1]; }
}
```

## 46. TypeScript: Advanced Patterns

### Type Guards & Narrowing
```typescript
function isString(val: unknown): val is string {
    return typeof val === "string";
}

function processValue(val: string | number) {
    if (typeof val === "string") {
        console.log(val.toUpperCase()); // TypeScript knows it's string
    } else {
        console.log(val.toFixed(2));    // TypeScript knows it's number
    }
}

// Discriminated Unions
type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle": return Math.PI * shape.radius ** 2;
        case "rect":   return shape.width * shape.height;
    }
}
```

### Utility Types
```typescript
interface User { id: number; name: string; email: string; }

type PartialUser  = Partial<User>;       // All fields optional
type RequiredUser = Required<User>;      // All fields required
type ReadonlyUser = Readonly<User>;      // All fields readonly
type UserPreview  = Pick<User, "id" | "name">;       // Only id, name
type UserUpdate   = Omit<User, "id">;                 // Everything except id
type StringFields = Record<string, string>;            // { [key: string]: string }
```

### Mapped Types & Conditional Types
```typescript
// Mapped type: make all fields nullable
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Conditional type
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// Extract & Exclude
type T1 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T2 = Exclude<"a" | "b" | "c", "a">;         // "b" | "c"
```

# Part 9 — Core Language Concepts (C++)

## 47. STL Basics (Vectors, Maps, Sets)

The Standard Template Library (STL) provides generic classes and functions. 

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <set>

using namespace std;

int main() {
    // Vector (Dynamic Array)
    vector<int> v = {1, 2, 3};
    v.push_back(4);

    // Map (Key-Value Pairs, ordered by key)
    map<string, int> m;
    m["Alice"] = 25;
    m.insert({"Bob", 30});

    // Set (Unique elements, ordered)
    set<int> s = {3, 1, 4, 1, 5}; // Contains: 1, 3, 4, 5

    return 0;
}
```

## 48. Pointers & References

**Pointers** store memory addresses. **References** are aliases for existing variables.

```cpp
int a = 10;
int* ptr = &a;   // Pointer to 'a'
int& ref = a;    // Reference to 'a'

*ptr = 20;       // Changes 'a' to 20
ref = 30;        // Changes 'a' to 30
```

## 49. Memory Management (Heap vs Stack)

- **Stack:** Fast, automatic memory allocation for local variables.
- **Heap:** Dynamic memory allocation using `new` (must be freed with `delete`).

```cpp
void memoryExample() {
    int stackVar = 5; // Allocated on the Stack

    // Allocated on the Heap
    int* heapVar = new int;
    *heapVar = 10;

    // Must prevent memory leaks
    delete heapVar; 
}
```

---

# Part 10 — Core Language Concepts (Java)

## 50. OOPs (Inheritance, Polymorphism)

**Inheritance** allows a class to inherit fields and methods from another. **Polymorphism** allows treating derived classes as their base class.

```java
class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() { // Polymorphism (Method Overriding)
        System.out.println("Bark");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog(); // Upcasting
        myDog.makeSound(); // Output: Bark
    }
}
```

## 51. Collections Framework

Provides standard data structures like Lists, Sets, and Maps.

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // ArrayList
        List<String> list = new ArrayList<>();
        list.add("Apple");

        // HashMap
        Map<String, Integer> map = new HashMap<>();
        map.put("Alice", 25);

        // HashSet
        Set<Integer> set = new HashSet<>(Arrays.asList(1, 2, 2, 3)); // Contains: 1, 2, 3
    }
}
```

## 52. Garbage Collection Basics

Java manages memory automatically. When an object is no longer referenced by the program, the **Garbage Collector (GC)** reclaims its memory.

```java
public class Main {
    public static void main(String[] args) {
        String obj1 = new String("Hello");
        String obj2 = new String("World");

        obj1 = null; // "Hello" object is now eligible for Garbage Collection
        
        // Suggests the JVM to run GC (not guaranteed)
        System.gc(); 
    }
}
```
