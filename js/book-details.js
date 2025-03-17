// Хранилище данных о книгах
const bookDatabase = {
    'the-48-laws-of-power': {
        title: 'The 48 Laws of Power',
        author: 'Robert Greene',
        coverImage: 'book48.webp',
        description: 'Amoral, cunning, ruthless, and instructive, this multi-million-copy New York Times bestseller combines three thousand years of the history of power into 48 essential laws.',
        pages: 452,
        publishDate: '1998',
        genre: 'Self-help, Psychology',
        dateRead: 'March 1, 2025'
    },
    'transurfing-of-reality': {
        title: 'Transerfing of reality I-V',
        author: 'Vadim Zeland',
        coverImage: 'book2.jpg',
        description: 'Reality Transurfing I-V offers a revolutionary technique for understanding the nature of reality and your place in it. Vadim Zeland combines metaphysical ideas with practical strategies that allow you to change your perception of the world, use your personal energy and create a reality that matches your inner intentions.',
        pages: 1500,
        publishDate: '2004-2007',
        genre: 'Metaphysics, Self-development, Philosophy',
        dateRead: 'November 1, 2024'
    },
    'dune': {
        title: 'Dune',
        author: 'Frank Herbert',
        coverImage: 'dune.webp',
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
        pages: 896,
        publishDate: '1965',
        genre: 'Science Fiction',
        dateRead: 'March 1, 2024'
    }
    // Добавьте больше книг по необходимости
};

// Функция для получения ID книги из URL
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Функция для отображения информации о книге
function displayBookDetails() {
    const bookId = getBookIdFromUrl();
    const bookData = bookDatabase[bookId];
    
    if (!bookData) {
        window.location.href = 'books.html'; // Редирект на страницу со списком книг если книга не найдена
        return;
    }
    
    // Заполняем данные на странице
    const bookCover = document.getElementById('bookCover');
    const bookTitle = document.getElementById('bookTitle');
    const bookAuthor = document.getElementById('bookAuthor');
    const dateRead = document.getElementById('dateRead');
    const bookDescription = document.getElementById('bookDescription');
    const pageCount = document.getElementById('pageCount');
    const publishDate = document.getElementById('publishDate');
    const genre = document.getElementById('genre');
    
    if (bookCover) bookCover.src = bookData.coverImage;
    if (bookCover) bookCover.alt = bookData.title;
    if (bookTitle) bookTitle.textContent = bookData.title;
    if (bookAuthor) bookAuthor.textContent = `By ${bookData.author}`;
    if (dateRead) dateRead.textContent = `Finished reading: ${bookData.dateRead}`;
    if (bookDescription) bookDescription.textContent = bookData.description;
    if (pageCount) pageCount.textContent = bookData.pages;
    if (publishDate) publishDate.textContent = bookData.publishDate;
    if (genre) genre.textContent = bookData.genre;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    displayBookDetails();
});

// Проверяем, нужно ли запустить функцию сразу (для случая, когда DOM уже загружен)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    displayBookDetails();
}

// Делаем функцию доступной глобально
window.displayBookDetails = displayBookDetails;