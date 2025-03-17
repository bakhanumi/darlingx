// Добавим в начало файла books.js базу данных книг
const booksData = [
    {
        id: 'the-48-laws-of-power',
        title: 'The 48 Laws of Power',
        author: 'Robert Greene',
        coverImage: 'book48.webp',
        dateRead: 'November 15, 2024'
    },
    {
        id: 'transurfing-of-reality',
        title: 'Transerfing of reality I-V',
        author: 'Vadim Zeland',
        coverImage: 'book2.jpg',
        dateRead: 'November 1, 2024'
    }//,
    //{
    //    id: 'dune',
    //    title: 'Dune',
    //    author: 'Frank Herbert',
    //    coverImage: 'dune.webp',
    //    dateRead: 'March 1, 2024'
    //}
    // Добавьте другие книги здесь
];

// Функция для переключения обложек
function toggleCovers(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const checkbox = document.getElementById('coverToggle');
    const booksGrid = document.getElementById('booksGrid');
    
    // Меняем состояние чекбокса на противоположное
    checkbox.checked = !checkbox.checked;
    
    // Обновляем класс сетки
    if (checkbox.checked) {
        booksGrid.classList.remove('hide-covers');
    } else {
        booksGrid.classList.add('hide-covers');
    }
    
    // Сохраняем состояние
    localStorage.setItem('showCovers', checkbox.checked);
}

// Функция инициализации
function initializeBooksHandlers() {
    const checkbox = document.getElementById('coverToggle');
    const booksGrid = document.getElementById('booksGrid');
    const switchLabel = document.querySelector('.switch');
    
    if (checkbox && booksGrid && switchLabel) {
        // Восстанавливаем сохраненное состояние
        const showCovers = localStorage.getItem('showCovers') !== 'false';
        checkbox.checked = showCovers;
        
        // Устанавливаем начальное состояние отображения
        if (!showCovers) {
            booksGrid.classList.add('hide-covers');
        }
        
        // Добавляем обработчик на переключатель
        switchLabel.addEventListener('click', toggleCovers);
    }
    
    // Инициализация обработчика сортировки
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        // Устанавливаем сохраненное значение сортировки
        const savedSort = localStorage.getItem('bookSort');
        if (savedSort) {
            sortSelect.value = savedSort;
        }
        
        // Обработчик изменения сортировки
        sortSelect.addEventListener('change', function() {
            // Сохраняем выбранное значение
            localStorage.setItem('bookSort', this.value);
            
            // Применяем сортировку
            sortBooks(this.value);
        });
        
        // Применяем начальную сортировку, если она была сохранена
        if (savedSort) {
            sortBooks(savedSort);
        }
    }
}

// Функция для инициализации сетки книг
function initializeBooksGrid() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

    // Очищаем текущее содержимое
    booksGrid.innerHTML = '';

    // Получаем сохраненную сортировку
    const savedSort = localStorage.getItem('bookSort');
    
    // Сортируем книги перед отображением, если сортировка была сохранена
    let booksToShow = [...booksData];
    if (savedSort) {
        booksToShow = sortBooksArray(booksToShow, savedSort);
    }

    // Создаем карточки для каждой книги
    booksToShow.forEach((bookData, index) => {
        const bookCard = createBookCard(bookData);
        bookCard.style.animation = `fadeIn 0.5s ease-out forwards ${index * 0.1}s`;
        booksGrid.appendChild(bookCard);
    });
    ensureBookCoversSize();
}

function ensureBookCoversSize() {
    // Добавляем класс, сигнализирующий об инициализации
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.classList.add('initialized');
    }
    
    // Проверяем размеры всех обложек книг
    const bookCovers = document.querySelectorAll('.book-cover');
    bookCovers.forEach(cover => {
        // Убеждаемся, что стили применены правильно
        cover.style.width = '100%';
        cover.style.maxWidth = '100%';
        
        // Добавляем обработчик загрузки для корректировки размеров
        cover.addEventListener('load', function() {
            // Устанавливаем естественные пропорции
            if (cover.naturalWidth > 0) {
                const ratio = cover.naturalHeight / cover.naturalWidth;
                // Применяем только если соотношение сторон не соответствует
                if (cover.height / cover.width !== ratio) {
                    cover.style.height = 'auto';
                }
            }
        });
        
        // Если изображение уже загружено
        if (cover.complete && cover.naturalWidth > 0) {
            const event = new Event('load');
            cover.dispatchEvent(event);
        }
    });
}

// Обновляем функцию сортировки
function sortBooks(sortType) {
    const sortedBooks = sortBooksArray([...booksData], sortType);
    
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;
    
    booksGrid.innerHTML = '';

    sortedBooks.forEach((bookData, index) => {
        const bookCard = createBookCard(bookData);
        bookCard.style.animation = `fadeIn 0.5s ease-out forwards ${index * 0.1}s`;
        booksGrid.appendChild(bookCard);
    });
}

// Функция сортировки массива книг
function sortBooksArray(books, sortType) {
    return books.sort((a, b) => {
        if (sortType === 'Author (A-Z)') {
            return a.author.localeCompare(b.author);
        } 
        else if (sortType === 'Title (A-Z)') {
            return a.title.localeCompare(b.title);
        }
        else if (sortType === 'Date Read') {
            // Предполагая, что даты в формате 'Month DD, YYYY'
            return new Date(b.dateRead) - new Date(a.dateRead);
        }
        return 0;
    });
}

// Обновляем создание карточки книги
function createBookCard(bookData) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    const bookLink = document.createElement('a');
    bookLink.href = `book-details.html?id=${bookData.id}`; // Добавляем ID книги в URL
    bookLink.className = 'book-link';
    
    bookLink.innerHTML = `
        <img class="book-cover" src="${bookData.coverImage}" alt="${bookData.title}">
        <h2 class="book-title">${bookData.title}</h2>
        <h3 class="book-author">${bookData.author}</h3>
    `;
    
    bookCard.appendChild(bookLink);
    return bookCard;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeBooksHandlers();
    initializeBooksGrid();
});

// Проверяем, нужно ли запустить функции сразу (для случая, когда DOM уже загружен)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeBooksHandlers();
    initializeBooksGrid();
}

// Делаем функции доступными глобально
window.initializeBooksHandlers = initializeBooksHandlers;
window.initializeBooksGrid = initializeBooksGrid;
window.sortBooks = sortBooks;
window.createBookCard = createBookCard;