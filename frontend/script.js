const BASE_URL = "https://librarysystem-ob89.onrender.com";

window.onload = function () {
    fetch(`${BASE_URL}/reset`);
};

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.innerText = message;

    if (type === "error") {
        toast.style.background = "#ff4d4d"; // red
    } else {
        toast.style.background = "#4CAF50"; // green
    }

    toast.style.opacity = 1;

    setTimeout(() => {
        toast.style.opacity = 0;
    }, 2500);
}

function issueBook(id) {
    fetch(`${BASE_URL}/issue?id=${id}`)
        .then(res => res.text())
        .then(data => {
            showToast(data, data.includes("issued") ? "success" : "error");
            loadBooks();
        });
}

function returnBook(id) {
    fetch(`${BASE_URL}/return?id=${id}`)
        .then(res => res.text())
        .then(data => {
            showToast(data, data.includes("returned") ? "success" : "error");
            loadBooks();
        });
}

function searchByTitle() {
    const title = document.getElementById("searchTitle").value;

    fetch(`${BASE_URL}/searchByTitle?title=${title}`)
        .then(res => res.text())
        .then(data => {
            document.getElementById("result").innerText = data;
        });
}

function addBook() {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;

    fetch(`${BASE_URL}/add?id=${id}&title=${title}`)
        .then(res => res.text())
        .then(data => {
            if (data.includes("already exists")) {
                showToast(data, "error"); // ❌ error toast
            } else {
                showToast(data, "success"); // ✅ success toast
                loadBooks();
            }
        });
}

function searchBook() {
    const id = document.getElementById("searchId").value;

    fetch(`${BASE_URL}/search?id=${id}`)
        .then(res => res.text())
        .then(data => {
            document.getElementById("result").innerText = "Result: " + data;
        });
}

function loadBooks() {
    fetch(`${BASE_URL}/books`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("bookList");
            list.innerHTML = "";

            data.books.forEach(book => {
    const li = document.createElement("li");

    const status = book.issued ? "❌ Issued" : "✅ Available";

    li.innerHTML = `
        ${book.id} - ${book.title} (${status})
        <br>
        <button onclick="issueBook(${book.id})">Issue</button>
        <button onclick="returnBook(${book.id})">Return</button>
    `;

    list.appendChild(li);
        });
   });
}