const btn_start = document.querySelector('.but_start')
const btn_down = document.querySelector('.but_down')
const btn_goHome = document.querySelector('.go_home')
const btn_goDown = document.querySelector('.go_down')
const btn_repit = document.querySelector('.repit')
const btn_Home = document.querySelector('.home')

const out_result = document.querySelector('.result')

const pg_start = document.querySelector('.main_start')
const pg_down = document.querySelector('.main_down')
const pg_game = document.querySelector('.game')
const pg_end = document.querySelector('.end')
const pg_main = document.querySelector('.main')

const container = document.querySelector('.game')

let cards = [];
let currentIndex = 0;
let correctCount = 0;

// Конец
btn_Home.addEventListener('click', () => {
    pg_end.style.display = 'none'
    pg_main.style.display = "flex"
    currentIndex = 0
    correctCount = 0
    container.innerHTML = ''
})

btn_repit.addEventListener('click', () => {
    currentIndex = 0       
    correctCount = 0       
    pg_game.style.display = 'flex'
    pg_end.style.display = 'none'
    container.innerHTML = ''
    showCard()
})

// Навигация
btn_goHome.addEventListener('click', () => {
    pg_start.style.display = "flex"
    pg_down.style.display = "none"
})
btn_goDown.addEventListener('click', () => {
    pg_down.style.display = "flex"
    pg_start.style.display = "none"
})

// Загрузка CSV
btn_down.addEventListener('change', function(e){
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(event){
        const text = event.target.result
        const rows = text.split('\n').map(r => r.trim()).filter(r => r).map(r => r.split(','))
        cards = rows.map(([q, a]) => ({ question: q, answer: a }));
        currentIndex = 0;
        correctCount = 0;
    }
    reader.readAsText(file)
})

// Старт игры
btn_start.addEventListener('click', () =>{
    pg_game.style.display = 'flex'
    pg_main.style.display = 'none'
    showCard()
})

function showCard() {
    if(currentIndex >= cards.length){
        pg_game.style.display = 'none'
        pg_end.style.display = 'flex'
        out_result.textContent = `${correctCount}/${cards.length}`;
        return;
    }

    container.innerHTML = ''; 

    const cardData = cards[currentIndex];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="quest">${cardData.question}</div>
        <div class="answer" style="display:none;">${cardData.answer}</div>
    `;
    container.appendChild(card);

    const questDiv = card.querySelector('.quest');
    const answerDiv = card.querySelector('.answer');

    let startX = 0, currentX = 0, isDragging = false;

    questDiv.addEventListener('click', function() {
        if(!isDragging) answerDiv.style.display = 'flex';
    });

    function startDrag(e) {
        isDragging = false;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        card.style.transition = 'none';
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', endDrag);
    }

    function onDrag(e) {
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const deltaX = x - startX;
        if(Math.abs(deltaX) > 5) isDragging = true;
        currentX = x;
        if(isDragging) card.style.transform = `translateX(${deltaX}px) rotate(${deltaX/10}deg)`;
    }

    function endDrag(e) {
        const deltaX = currentX - startX;
        card.style.transition = 'transform 0.3s ease';

        if(!isDragging || Math.abs(deltaX) < 100){
            card.style.transform = 'translateX(0)';
        } else {
            if(deltaX > 100) correctCount++;
            card.style.transform = `translateX(${deltaX > 0 ? 1000 : -1000}px)`;
            currentIndex++;
            setTimeout(showCard, 300);
        }

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', endDrag);
    }

    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);
}
