export default async function main() {
    // 검색창 focus/blur 스타일 변경 기능
    const searchInput = document.querySelector('.search-input'); 
    searchInput.addEventListener('focus', () => { searchInput.style.borderColor = '#03c75a'; });
    searchInput.addEventListener('blur', () => { searchInput.style.borderColor = '#ddd'; });

    // 뉴스 스탠드 메뉴 탭 기능 (종합/스포츠/엔터)
    const newsMenuButtons = document.querySelectorAll('.news-menu-btn');
    const newsListGeneral = document.querySelector('.news-list-general');
    const newsListSports = document.querySelector('.news-list-sports');
    // 👇👇👇 여기에 엔터테인먼트 뉴스 목록 변수 추가! 👇👇👇
    const newsListEntertainment = document.querySelector('.news-list-entertainment');

    function showNewsList(type) {
        // 모든 메뉴 버튼에서 'active' 클래스 제거
        newsMenuButtons.forEach(button => button.classList.remove('active'));
        // 현재 선택된 버튼에 'active' 클래스 추가
        const activeButton = document.querySelector(`.news-menu-btn[data-news-type="${type}"]`);
        if (activeButton) activeButton.classList.add('active');

        // 모든 뉴스 목록 숨기기
        newsListGeneral.style.display = 'none';
        newsListSports.style.display = 'none';
        newsListEntertainment.style.display = 'none'; // 👇 엔터테인먼트 뉴스도 숨기기

        // 선택된 뉴스 타입에 해당하는 목록만 보여주기
        if (type === 'general') {
            newsListGeneral.style.display = 'grid';
        } else if (type === 'sports') {
            newsListSports.style.display = 'grid';
        } else if (type === 'entertainment') { // 👇 엔터테인먼트 뉴스 타입 처리!
            newsListEntertainment.style.display = 'grid';
        }
    }

    // 각 메뉴 버튼에 클릭 이벤트 리스너 추가
    newsMenuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const newsType = e.target.dataset.newsType; // 버튼의 data-news-type 값 가져오기
            showNewsList(newsType); // 해당 타입의 뉴스 목록 표시
        });
    });

    // 페이지 로드 시 기본으로 '종합' 뉴스 스탠드를 표시
    showNewsList('general');

    // 계산기 기능 로직 (이전과 동일)
    const calcDisplay = document.getElementById('calc-display'); 
    const numberButtons = document.querySelectorAll('.btn-number'); 
    const operatorButtons = document.querySelectorAll('.btn-operator'); 
    const equalsButton = document.querySelector('.btn-equals'); 
    const clearButton = document.querySelector('.btn-clear'); 

    let currentInput = '0'; 
    let firstOperand = null; 
    let operator = null; 
    let waitingForSecondOperand = false; 

    function updateDisplay() {
        calcDisplay.textContent = currentInput;
    }

    function inputNumber(number) {
        if (waitingForSecondOperand === true) { 
            currentInput = number;
            waitingForSecondOperand = false;
        } else { 
            if (number === '.' && currentInput.includes('.')) { return; }
            currentInput = currentInput === '0' && number !== '.' ? number : currentInput + number;
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput); 

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) { firstOperand = inputValue; } 
        else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    function calculate(first, second, op) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') {
            if (second === 0) { alert("0으로 나눌 수 없습니다."); return first; }
            return first / second;
        }
        return second;
    }

    function resetCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    numberButtons.forEach(button => {
        button.addEventListener('click', (e) => inputNumber(e.target.dataset.number));
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', (e) => handleOperator(e.target.dataset.operator));
    });

    equalsButton.addEventListener('click', () => {
        if (firstOperand === null || operator === null) return;
        
        const inputValue = waitingForSecondOperand ? firstOperand : parseFloat(currentInput);
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;

        operator = null;
        waitingForSecondOperand = true;
        updateDisplay();
    });

    clearButton.addEventListener('click', resetCalculator);

    updateDisplay();
}