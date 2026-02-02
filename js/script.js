// Основной скрипт
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Анимация статистики
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            if (element.dataset.count.includes('%')) {
                element.textContent = value + '%';
            } else {
                element.textContent = value + (element.dataset.count.includes('+') ? '+' : '');
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Запуск анимации статистики при скролле
    function checkStatsAnimation() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateValue(stat, 0, target, 1500);
                }
            });
        }
    }
    
    window.addEventListener('scroll', checkStatsAnimation);
    checkStatsAnimation(); // Проверить при загрузке
    
    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Форма подписки
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // В реальном проекте здесь был бы AJAX-запрос
            this.innerHTML = `
                <div class="success-message" style="
                    text-align: center;
                    padding: 20px;
                    background: rgba(76, 175, 80, 0.1);
                    border-radius: var(--radius-sm);
                    border: 1px solid rgba(76, 175, 80, 0.3);
                ">
                    <i class="fas fa-check-circle" style="
                        color: #4caf50;
                        font-size: 2rem;
                        margin-bottom: 10px;
                    "></i>
                    <p style="margin: 0;">Спасибо за подписку!<br>Письмо с подтверждением отправлено на ${email}</p>
                </div>
            `;
        });
    }
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.mission-card, .teacher-card, .discipline-card, .program-card, .news-card').forEach(el => {
        observer.observe(el);
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        el.classList.add('animate-in');
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Фильтр таблицы (для страницы преподавателей)
    const filterInput = document.querySelector('.table-filter');
    if (filterInput) {
        filterInput.addEventListener('input', function() {
            const filter = this.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
    
    // Сортировка таблицы
    document.querySelectorAll('.data-table th').forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            sortTable(index);
        });
    });
    
    function sortTable(column) {
        const table = document.querySelector('.data-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const isNumeric = column === 0; // Первая колонка с номерами
        const isAsc = table.dataset.sortColumn === String(column) && table.dataset.sortOrder === 'asc';
        
        rows.sort((a, b) => {
            const aVal = a.cells[column].textContent.trim();
            const bVal = b.cells[column].textContent.trim();
            
            if (isNumeric) {
                return isAsc ? bVal - aVal : aVal - bVal;
            } else {
                return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            }
        });
        
        // Удаляем старые строки
        rows.forEach(row => tbody.removeChild(row));
        
        // Добавляем отсортированные
        rows.forEach(row => tbody.appendChild(row));
        
        // Обновляем состояние сортировки
        table.dataset.sortColumn = column;
        table.dataset.sortOrder = isAsc ? 'desc' : 'asc';
    }
    
    // Кнопка "Наверх"
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 100;
    `;
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    });
    
    // Инициализация Swiper (если подключен)
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.teachers-slider', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 }
            }
        });
    }
});