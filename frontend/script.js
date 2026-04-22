const BASE_URL = "https://librarysystem-ob89.onrender.com";

function addBook() {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;

    fetch(`${BASE_URL}/add?id=${id}&title=${title}`)
        .then(res => res.text())
        .then(data => alert(data));
}

function searchBook() {
    const id = document.getElementById("searchId").value;

    fetch(`${BASE_URL}/search?id=${id}`)
        .then(res => res.text())
        .then(data => {
            document.getElementById("result").innerText = data;
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
                li.innerText = book.id + " - " + book.title;
                list.appendChild(li);
            });
        });
}