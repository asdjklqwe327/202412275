export default async function main() {
    // ======== 1. 검색창 포커스 이벤트 ========
    const searchInput = document.querySelector('.search-input'); 

    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#03c75a';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#ddd';
    });

    // ======== 2. 계산기 기능 ========
    const calcDisplay = document.getElementById('calc-display'); // 계산기 화면 (결과 표시되는 곳)
    const numberButtons = document.querySelectorAll('.btn-number'); // 숫자 버튼들
    const operatorButtons = document.querySelectorAll('.btn-operator'); // 🚨🚨🚨 오타 수정 완료!
    const equalsButton = document.querySelector('.btn-equals'); // = 버튼
    const clearButton = document.querySelector('.btn-clear'); // C 버튼

    let currentInput = '0'; // 현재 입력 중인 숫자
    let firstOperand = null; // 첫 번째 숫자
    let operator = null; // 선택된 연산자
    let waitingForSecondOperand = false; // 두 번째 숫자 입력을 기다리는 중인지 여부

    // 화면에 숫자 업데이트 함수 (단순화: currentInput만 표시)
    function updateDisplay() {
        calcDisplay.textContent = currentInput;
    }

    // 숫자 버튼 클릭 시 처리
    function inputNumber(number) {
        if (waitingForSecondOperand === true) { // 연산자 누르고 새 숫자 입력 시작
            currentInput = number;
            waitingForSecondOperand = false;
        } else { // 계속해서 숫자 입력
            if (number === '.' && currentInput.includes('.')) { // 소수점 중복 방지
                return;
            }
            currentInput = currentInput === '0' && number !== '.' ? number : currentInput + number;
        }
        updateDisplay();
    }

    // 연산자 버튼 클릭 시 처리 (단순화)
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput); // 현재 입력값을 숫자로 변환

        if (operator && waitingForSecondOperand) { // 연속 연산자 입력 시, 연산자만 변경
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) { // 첫 번째 숫자 입력
            firstOperand = inputValue;
        } else if (operator) { // 두 번째 숫자 입력 후 연산자 입력 (계산 수행)
            const result = calculate(firstOperand, inputValue, operator);
            currentInput = `${parseFloat(result.toFixed(7))}`; // 계산 결과를 현재 입력값으로 설정 (소수점 정리)
            firstOperand = result; // 계산 결과를 다시 첫 번째 숫자로 설정
        }

        waitingForSecondOperand = true; // 다음은 두 번째 숫자 입력
        operator = nextOperator; // 연산자 저장
        updateDisplay();
    }

    // 실제 계산 수행 함수
    function calculate(first, second, op) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') {
            if (second === 0) { // 0으로 나누기 방지
                alert("0으로 나눌 수 없습니다.");
                return first; // 계산 오류 시 첫 번째 피연산자 값을 유지
            }
            return first / second;
        }
        return second; // 오류 시 두 번째 숫자 반환
    }

    // 초기화 함수 (C 버튼)
    function resetCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    // === 이벤트 리스너 연결 ===
    numberButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            inputNumber(event.target.dataset.number);
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            handleOperator(event.target.dataset.operator);
        });
    });

    equalsButton.addEventListener('click', () => {
        if (firstOperand === null || operator === null) { // 첫 숫자나 연산자가 없으면 계산 안 함
            return;
        }
        // = 버튼 누른 후, waitingForSecondOperand가 true라면 반복 연산 (ex: 5 + = 하면 5+5)
        // 아니면 일반 계산 (ex: 5 + 3 = 하면 5+3)
        const inputValue = waitingForSecondOperand ? firstOperand : parseFloat(currentInput);
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`; 
        firstOperand = result;
        
        operator = null; // 계산 후 연산자 초기화
        waitingForSecondOperand = true; // 다음 숫자 입력 대기 (현재 결과가 첫 번째 피연산자가 됨)
        updateDisplay();
    });

    clearButton.addEventListener('click', () => resetCalculator()); // C 버튼 클릭 시 초기화

    // 초기 화면 업데이트
    updateDisplay();
}