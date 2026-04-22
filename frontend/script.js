const BASE_URL = "https://librarysystem-ob89.onrender.com";

window.onload = function () {
    fetch(`${BASE_URL}/reset`);
};

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.opacity = 1;

    setTimeout(() => {
        toast.style.opacity = 0;
    }, 2000);
}

function addBook() {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;

    fetch(`${BASE_URL}/add?id=${id}&title=${title}`)
        .then(res => res.text())
        .then(data => {
            showToast(data);
            loadBooks();
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
                li.innerText = `${book.id} - ${book.title}`;
                list.appendChild(li);
            });
        });
}