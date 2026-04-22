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

root = None

def insert(root, id, title):
    if not root:
        return Node(id, title)
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

def inorder(root, result):
    if root:
        inorder(root.left, result)
        result.append({"id": root.id, "title": root.title})
        inorder(root.right, result)

# ---------------- API ----------------

@app.route("/add")
def add_book():
    global root
    id = int(request.args.get("id"))
    title = request.args.get("title")
    root = insert(root, id, title)
    return "Book added"

@app.route("/search")
def search_book():
    id = int(request.args.get("id"))
    res = search(root, id)
    return res.title if res else "Not found"

@app.route("/books")
def get_books():
    result = []
    inorder(root, result)
    return {"books": result}

# ---------------- RUN ----------------

app.run(port=5000)