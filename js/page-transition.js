/**
 * page-transition.js
 * Handles smooth transitions between pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация обработчиков для текущей страницы
    initializePageHandlers();
});

// Хранилище для запомненных загруженных CSS
const loadedStyles = new Set();

// Функция для определения базового пути
function getBasePath() {
    // Получаем текущий путь
    const path = window.location.pathname;
    // Проверяем, есть ли папка в пути
    const pathParts = path.split('/').filter(part => part !== '');
    
    // Если сайт в подпапке на домене, получаем её имя
    if (pathParts.length > 0) {
        // Исключаем html-файлы из пути
        const folderParts = pathParts.filter(part => !part.endsWith('.html'));
        if (folderParts.length > 0) {
            return '/' + folderParts[0];
        }
    }
    
    return '';
}

// Получаем базовый путь для всех запросов
const basePath = getBasePath();

// Функция инициализации обработчиков
function initializePageHandlers() {
    // Инициализация книжной страницы
    if (document.querySelector('.books-grid')) {
        // Предварительно проверяем, загружены ли нужные стили
        loadRequiredStyles('books', function() {
            initializeBooksHandlers();
            ensureImagesSize();
        });
    }
    
    // Инициализация страницы с детальной информацией о книге
    if (document.querySelector('.book-details')) {
        // Предварительно проверяем, загружены ли нужные стили
        loadRequiredStyles('book-details', function() {
            displayBookDetails();
            ensureImagesSize();
        });
    }
}

// Функция для инициализации обработчиков книжной страницы
function initializeBooksHandlers() {
    const checkbox = document.getElementById('coverToggle');
    const booksGrid = document.getElementById('booksGrid');
    const switchLabel = document.querySelector('.switch');
    
    if (checkbox && booksGrid && switchLabel) {
        // Восстанавливаем сохраненное состояние
        const showCovers = localStorage.getItem('showCovers') !== 'false';
        checkbox.checked = showCovers;
        
        if (!showCovers) {
            booksGrid.classList.add('hide-covers');
        }
        
        // Добавляем обработчик на переключатель
        switchLabel.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                booksGrid.classList.remove('hide-covers');
            } else {
                booksGrid.classList.add('hide-covers');
            }
            
            localStorage.setItem('showCovers', checkbox.checked);
        });
    }
    
    // Инициализация сортировки книг
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        // Устанавливаем сохраненное значение сортировки
        const savedSort = localStorage.getItem('bookSort');
        if (savedSort) {
            sortSelect.value = savedSort;
        }
        
        // Добавляем обработчик изменения
        sortSelect.addEventListener('change', function() {
            localStorage.setItem('bookSort', this.value);
            // Проверяем доступность функции sortBooks
            if (typeof window.sortBooks === 'function') {
                window.sortBooks(this.value);
            } else if (typeof sortBooks === 'function') {
                sortBooks(this.value);
            }
        });
        
        // Инициализация сетки книг
        if (typeof window.initializeBooksGrid === 'function') {
            window.initializeBooksGrid();
        } else if (typeof initializeBooksGrid === 'function') {
            initializeBooksGrid();
        }
    }
}

// Функция для получения ID книги из URL
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Функция для отображения информации о книге
function displayBookDetails() {
    // Проверяем, загружен ли скрипт book-details.js
    if (typeof bookDatabase === 'undefined') {
        // Если скрипт не загружен, загружаем его
        loadScript(basePath + '/js/book-details.js', function() {
            showBookData();
            setTimeout(ensureImagesSize, 50);
        });
    } else {
        showBookData();
        setTimeout(ensureImagesSize, 50);
    }
}

// Функция для отображения данных книги
function showBookData() {
    if (typeof window.displayBookDetails === 'function') {
        window.displayBookDetails();
    } else if (typeof bookDatabase !== 'undefined') {
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
}

// Функция для проверки и исправления размеров изображений
function ensureImagesSize() {
    // Для всех книжных обложек
    const bookCovers = document.querySelectorAll('.book-cover');
    bookCovers.forEach(cover => {
        // Устанавливаем базовые размеры
        cover.style.width = '100%';
        cover.style.maxWidth = '100%';
        cover.style.height = 'auto';
        
        // Добавляем обработчик загрузки для фиксации размеров
        if (!cover.hasAttribute('data-sized')) {
            cover.setAttribute('data-sized', 'true');
            cover.addEventListener('load', function() {
                // Корректируем пропорции при необходимости
                this.style.width = '100%';
                this.style.height = 'auto';
            });
            
            // Если изображение уже загружено
            if (cover.complete) {
                cover.style.width = '100%';
                cover.style.height = 'auto';
            }
        }
    });
    
    // Для детальной страницы книги
    const detailsCover = document.querySelector('.book-details .book-cover');
    if (detailsCover) {
        detailsCover.style.width = '300px';
        detailsCover.style.maxWidth = '100%';
        detailsCover.style.height = 'auto';
        
        // Добавляем класс для дополнительных стилей
        detailsCover.classList.add('detail-view');
    }
    
    // Для сетки книг
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.classList.add('initialized');
    }
    
    // Добавляем стили для обеспечения поддержки размеров
    if (!document.getElementById('dynamic-book-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-book-styles';
        styleElement.textContent = `
            .book-cover {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                transition: all 0.3s ease;
            }
            
            .book-details .book-cover.detail-view {
                width: 300px !important;
                max-width: 100% !important;
                height: auto !important;
            }
            
            .book-card {
                min-height: 200px;
            }
            
            @media (max-width: 768px) {
                .book-details .book-cover.detail-view {
                    width: 100% !important;
                    max-width: 300px !important;
                    margin: 0 auto;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Функция для загрузки необходимых стилей
function loadRequiredStyles(pageType, callback) {
    let stylesToLoad = [];
    
    // Версия для сброса кэша браузера
    const cacheVersion = new Date().getTime();
    
    // Определяем необходимые стили в зависимости от типа страницы
    if (pageType === 'books') {
        stylesToLoad = [
            basePath + '/css/style.css',
            basePath + '/css/constellation.css',
            basePath + '/css/books.css'
        ];
    } else if (pageType === 'book-details') {
        stylesToLoad = [
            basePath + '/css/style.css',
            basePath + '/css/constellation.css',
            basePath + '/css/book-details.css'
        ];
    } else {
        // Для остальных страниц загружаем только общие стили
        stylesToLoad = [
            basePath + '/css/style.css',
            basePath + '/css/constellation.css'
        ];
    }
    
    // Добавляем параметр для сброса кэша
    stylesToLoad = stylesToLoad.map(style => style + '?v=' + cacheVersion);
    
    // Фильтруем только те стили, которые еще не загружены
    const stylesToAdd = stylesToLoad.filter(style => !loadedStyles.has(style));
    
    // Если все стили уже загружены, просто вызываем callback
    if (stylesToAdd.length === 0) {
        // Проверяем размеры изображений даже если все стили загружены
        setTimeout(ensureImagesSize, 50);
        if (callback) callback();
        return;
    }
    
    // Счетчик загруженных стилей
    let loadedCount = 0;
    
    // Загружаем каждый стиль
    stylesToAdd.forEach(style => {
        loadCSS(style, function() {
            loadedStyles.add(style);
            loadedCount++;
            
            // Когда все стили загружены, вызываем callback
            if (loadedCount === stylesToAdd.length) {
                // Добавляем небольшую задержку для полного применения стилей
                setTimeout(() => {
                    // Проверяем и исправляем размеры изображений
                    ensureImagesSize();
                    
                    // Вызываем переданный callback
                    if (callback) callback();
                }, 50);
            }
        });
    });
}

// Функция для загрузки CSS
function loadCSS(href, callback) {
    // Проверяем, загружен ли уже этот стиль
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    for (const link of existingLinks) {
        if (link.href.includes(href.split('?')[0])) {
            if (callback) callback();
            return;
        }
    }
    
    // Создаем новый элемент link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    // Добавляем обработчик загрузки
    link.onload = function() {
        if (callback) callback();
    };
    
    // Обработчик ошибки
    link.onerror = function() {
        console.error(`Failed to load style: ${href}`);
        if (callback) callback();
    };
    
    // Добавляем в head
    document.head.appendChild(link);
}

// Функция для загрузки скрипта
function loadScript(src, callback) {
    // Добавляем версию для сброса кэша
    const cacheVersion = new Date().getTime();
    const srcWithVersion = src + '?v=' + cacheVersion;
    
    // Проверяем, загружен ли уже скрипт
    const existingScripts = document.querySelectorAll('script');
    for (const script of existingScripts) {
        if (script.src.includes(src)) {
            if (callback) callback();
            return;
        }
    }
    
    // Создаем новый элемент script
    const script = document.createElement('script');
    script.src = srcWithVersion;
    
    // Добавляем обработчик загрузки
    script.onload = function() {
        console.log(`Script loaded: ${src}`);
        if (callback) callback();
    };
    
    // Обработчик ошибки
    script.onerror = function() {
        console.error(`Failed to load script: ${src}`);
        if (callback) callback();
    };
    
    // Добавляем в head
    document.head.appendChild(script);
}

// Определяем тип страницы по URL или содержимому
function getPageType(url, document) {
    if (url.includes('book-details.html')) {
        return 'book-details';
    } else if (url.includes('books.html')) {
        return 'books';
    } else if (document.querySelector('.book-details')) {
        return 'book-details';
    } else if (document.querySelector('.books-grid')) {
        return 'books';
    }
    return 'other';
}

// Обработка переходов между страницами
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        
        // Добавляем класс для индикации загрузки
        document.body.classList.add('page-loading');
        
        fetch(link.href)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                
                // Определяем тип загружаемой страницы
                const pageType = getPageType(link.href, newDoc);
                
                // Загружаем необходимые стили перед обновлением контента
                loadRequiredStyles(pageType, function() {
                    // Обновляем содержимое
                    document.querySelector('main').innerHTML = newDoc.querySelector('main').innerHTML;
                    
                    // Обновляем заголовок
                    document.title = newDoc.title;
                    
                    // Обновляем URL
                    window.history.pushState({}, '', link.href);
                    
                    // Загружаем необходимые скрипты для страницы
                    if (pageType === 'book-details') {
                        loadScript(basePath + '/js/book-details.js', function() {
                            // После загрузки инициализируем страницу
                            displayBookDetails();
                            
                            // Проверяем размеры изображений
                            setTimeout(ensureImagesSize, 100);
                            
                            document.body.classList.remove('page-loading');
                        });
                    } else if (pageType === 'books') {
                        loadScript(basePath + '/js/books.js', function() {
                            // Инициализируем страницу с книгами
                            if (typeof window.initializeBooksGrid === 'function') {
                                window.initializeBooksGrid();
                            }
                            
                            initializeBooksHandlers();
                            
                            // Проверяем размеры изображений
                            setTimeout(ensureImagesSize, 100);
                            
                            document.body.classList.remove('page-loading');
                        });
                    } else {
                        // Для других страниц
                        initializePageHandlers();
                        document.body.classList.remove('page-loading');
                    }
                });
            })
            .catch(error => {
                console.error('Error during page transition:', error);
                document.body.classList.remove('page-loading');
                // В случае ошибки переходим по ссылке обычным способом
                window.location.href = link.href;
            });
    }
});

// Обработка навигации браузера (кнопки вперед/назад)
window.addEventListener('popstate', function() {
    // Добавляем класс для индикации загрузки
    document.body.classList.add('page-loading');
    
    fetch(window.location.href)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Определяем тип загружаемой страницы
            const pageType = getPageType(window.location.href, newDoc);
            
            // Загружаем необходимые стили перед обновлением контента
            loadRequiredStyles(pageType, function() {
                // Обновляем содержимое
                document.querySelector('main').innerHTML = newDoc.querySelector('main').innerHTML;
                
                // Обновляем заголовок
                document.title = newDoc.title;
                
                // Загружаем необходимые скрипты для страницы
                if (pageType === 'book-details') {
                    loadScript(basePath + '/js/book-details.js', function() {
                        // После загрузки инициализируем страницу
                        displayBookDetails();
                        
                        // Проверяем размеры изображений
                        setTimeout(ensureImagesSize, 100);
                        
                        document.body.classList.remove('page-loading');
                    });
                } else if (pageType === 'books') {
                    loadScript(basePath + '/js/books.js', function() {
                        // Инициализируем страницу с книгами
                        if (typeof window.initializeBooksGrid === 'function') {
                            window.initializeBooksGrid();
                        }
                        
                        initializeBooksHandlers();
                        
                        // Проверяем размеры изображений
                        setTimeout(ensureImagesSize, 100);
                        
                        document.body.classList.remove('page-loading');
                    });
                } else {
                    // Для других страниц
                    initializePageHandlers();
                    document.body.classList.remove('page-loading');
                }
            });
        })
        .catch(error => {
            console.error('Error during popstate handling:', error);
            document.body.classList.remove('page-loading');
            // В случае ошибки перезагружаем страницу
            window.location.reload();
        });
});

// Добавляем стили для индикации загрузки
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
.page-loading {
    cursor: progress;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}
.page-loading * {
    pointer-events: none;
}
`;
document.head.appendChild(loadingStyle);

// Экспортируем функции для использования в других скриптах
window.pageTransition = {
    initializePageHandlers: initializePageHandlers,
    displayBookDetails: displayBookDetails,
    initializeBooksHandlers: initializeBooksHandlers,
    loadRequiredStyles: loadRequiredStyles,
    ensureImagesSize: ensureImagesSize,
    basePath: basePath
};

// Добавляем отладочную информацию в консоль
console.log('Page Transition initialized with basePath:', basePath);