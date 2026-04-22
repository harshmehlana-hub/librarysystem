from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------- BST ----------------

class Node:
    def __init__(self, id, title):
        self.id = id
        self.title = title
        self.left = None
        self.right = None
        self.issued = False  

root = None

def insert(root, id, title):
    if not root:
        return Node(id, title)

    # duplicate
    if id == root.id:
        return root  # do nothing if duplicate

    if id < root.id:
        root.left = insert(root.left, id, title)
    else:
        root.right = insert(root.right, id, title)

    return root

def search(root, id):
    if not root or root.id == id:
        return root
    if id < root.id:
        return search(root.left, id)
    return search(root.right, id)

def search_by_title(root, title):
    if not root:
        return None

    if root.title.lower() == title.lower():
        return root

    left = search_by_title(root.left, title)
    if left:
        return left

    return search_by_title(root.right, title)

def inorder(root, result):
    if root is None:
        return

    inorder(root.left, result)

    result.append({
        "id": root.id,
        "title": root.title,
        "issued": getattr(root, "issued", False) 
    })

    inorder(root.right, result)

# ---------------- API ----------------

@app.route("/add")
def add_book():
    global root
    id = int(request.args.get("id"))
    title = request.args.get("title")

    # check duplicate
    if search(root, id):
        return "Book ID already exists"

    root = insert(root, id, title)
    return "Book added"

@app.route("/search")
def search_book():
    id = int(request.args.get("id"))
    res = search(root, id)
    return res.title if res else "Not found"

@app.route("/books")
@app.route("/books")
def get_books():
    result = []
    inorder(root, result)
    return {"books": result}

@app.route("/reset")
def reset():
    global root
    root = None
    return "Library reset"

@app.route("/issue")
def issue_book():
    id = int(request.args.get("id"))
    book = search(root, id)

    if not book:
        return "Book not found"
    if book.issued:
        return "Already issued"

    book.issued = True
    return "Book issued"

@app.route("/return")
def return_book():
    id = int(request.args.get("id"))
    book = search(root, id)

    if not book:
        return "Book not found"

    if not book.issued:
        return "Book already available"

    book.issued = False
    return "Book returned"

@app.route("/searchByTitle")
def search_title():
    title = request.args.get("title")
    book = search_by_title(root, title)

    if book:
        status = "Issued" if book.issued else "Available"
        return f"{book.id} - {book.title} ({status})"
    else:
        return "Book not found"

# ---------------- RUN ----------------

import os
app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))