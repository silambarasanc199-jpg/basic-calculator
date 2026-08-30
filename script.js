const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentNumber = "";
let previousNumber = "";
let operator = null;
let resetDisplay = false;

function updateDisplay() {
  currentDisplay.textContent = currentNumber || "0";

  if (operator && previousNumber !== "") {
    previousDisplay.textContent = `${previousNumber} ${getOperatorSymbol(operator)}`;
  } else {
    previousDisplay.textContent = "";
  }
}

function getOperatorSymbol(op) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[op] || op;
}

function appendNumber(number) {
  if (resetDisplay) {
    currentNumber = "";
    resetDisplay = false;
  }

  if (number === "." && currentNumber.includes(".")) {
    return;
  }

  if (currentNumber === "" && number === ".") {
    currentNumber = "0";
  }

  currentNumber += number;
  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (currentNumber === "" && previousNumber === "") {
    return;
  }

  if (currentNumber === "" && previousNumber !== "") {
    operator = selectedOperator;
    updateDisplay();
    return;
  }

  if (previousNumber !== "" && operator) {
    calculate();
  }

  previousNumber = currentNumber;
  currentNumber = "";
  operator = selectedOperator;

  updateDisplay();
}

function calculate() {
  if (
    previousNumber === "" ||
    currentNumber === "" ||
    operator === null
  ) {
    return;
  }

  const firstNumber = parseFloat(previousNumber);
  const secondNumber = parseFloat(currentNumber);

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":
      if (secondNumber === 0) {
        currentNumber = "Cannot divide by zero";
        previousNumber = "";
        operator = null;
        resetDisplay = true;
        updateDisplay();
        return;
      }

      result = firstNumber / secondNumber;
      break;

    default:
      return;
  }

  currentNumber = formatResult(result);
  previousNumber = "";
  operator = null;
  resetDisplay = true;

  updateDisplay();
}

function formatResult(number) {
  if (!Number.isFinite(number)) {
    return "Error";
  }

  return Number(number.toFixed(10)).toString();
}

function clearCalculator() {
  currentNumber = "";
  previousNumber = "";
  operator = null;
  resetDisplay = false;

  updateDisplay();
}

function deleteNumber() {
  if (resetDisplay) {
    return;
  }

  currentNumber = currentNumber.slice(0, -1);

  updateDisplay();
}

/* Number buttons */
document.querySelectorAll("[data-number]").forEach(button => {
  button.addEventListener("click", () => {
    appendNumber(button.dataset.number);
  });
});

/* Operator buttons */
document.querySelectorAll("[data-operator]").forEach(button => {
  button.addEventListener("click", () => {
    chooseOperator(button.dataset.operator);
  });
});

/* Action buttons */
document.querySelector("[data-action='equals']")
  .addEventListener("click", calculate);

document.querySelector("[data-action='clear']")
  .addEventListener("click", clearCalculator);

document.querySelector("[data-action='delete']")
  .addEventListener("click", deleteNumber);

/* Keyboard support */
document.addEventListener("keydown", event => {

  if (
    (event.key >= "0" && event.key <= "9") ||
    event.key === "."
  ) {
    appendNumber(event.key);
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    calculate();
  }

  if (event.key === "Escape") {
    clearCalculator();
  }

  if (event.key === "Backspace") {
    deleteNumber();
  }
});

updateDisplay();