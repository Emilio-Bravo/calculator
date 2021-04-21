const initApp = () => {
  const currentValueElem = document.querySelector(".currentValue");
  const previousValueElem = document.querySelector(".previous-value");
  let itemArray = [];
  const equationArray = [];
  let newNumberFlag = false;

  const inputButtons = document.querySelectorAll(".number");
  inputButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      playAudio();
      const newInput = e.target.textContent;
      if (newNumberFlag) {
        currentValueElem.value = newInput;
        newNumberFlag = false;
      } else {
        currentValueElem.value =
          currentValueElem.value == 0
            ? newInput
            : `${currentValueElem.value}${newInput}`;
      }
    });
  });

  const clearButtons = document.querySelectorAll(".clear, .clearEntry");
  clearButtons.forEach((button) => {
    playAudio();
    button.addEventListener("click", (e) => {
      currentValueElem.value = 0;
      previousValueElem.textContent = "";
      if (e.target.classList.contains("clear")) {
        previousValueElem.textContent = "";
        itemArray = [];
      }
    });
  });
  const DeleteButton = document.querySelector(".delete");
  DeleteButton.addEventListener("click", () => {
    playAudio();
    currentValueElem.value = currentValueElem.value.slice(0, -1);
  });

  const signChangeButton = document.querySelector(".signChange");
  signChangeButton.addEventListener("click", () => {
    playAudio();
    currentValueElem.value = parseFloat(currentValueElem.value) * -1;
  });
  const opButtons = document.querySelectorAll(".operator");
  opButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      playAudio();
      /*
           Equal sign showing 
        */
      if (newNumberFlag) {
        previousValueElem.textContent = "";
        itemArray = [];
      }

      const newOperator = e.target.textContent;
      const currentVal = currentValueElem.value;

      /* Need number first */

      if (!itemArray.length && currentVal == 0) return;

      /* Begin new equation */

      if (!itemArray.length) {
        itemArray.push(currentVal, newOperator);
        previousValueElem.textContent = `${currentVal} 
        ${newOperator}`;
        return (newNumberFlag = true);
      }

      /* Complete equation */

      if (itemArray.length) {
        itemArray.push(currentVal); // 3rd element

        const equationObj = {
          num1: parseFloat(itemArray[0]),
          num2: parseFloat(currentVal),
          op: itemArray[1],
        };
        equationArray.push(equationObj);
        const equationString = `${equationObj.num1}
           ${equationObj.op}
           ${equationObj.num2}`;

        const newValue = calculate(equationString, currentValueElem);

        previousValueElem.textContent = `${newValue} ${newOperator}`;

        /* Start new equation */

        itemArray[(newValue, newOperator)];
        newNumberFlag = true;
        console.log(equationArray);
      }
    });
  });
  const equalsButton = document.querySelector(".equals");
  equalsButton.addEventListener("click", () => {
    playAudio();
    const currentVal = currentValueElem.value;
    let equationObj;

    /* Pressing equals repeatedly */

    if (!itemArray.length && equationArray.length) {
      const lastEquation = equationArray[equationArray.length - 1];
      equationObj = {
        num1: parseFloat(currentVal),
        num2: lastEquation.num2,
        op: lastEquation.op,
      };
    } else if (!itemArray.length) {
      return currentVal;
    } else {
      itemArray.push(currentVal);
      equationObj = {
        num1: parseFloat(itemArray[0]),
        num2: parseFloat(currentVal),
        op: itemArray[1],
      };
    }

    equationArray.push(equationObj);
    const equationString = `${equationObj.num1} ${equationObj.op} ${equationObj.num2}`;
    calculate(equationString, currentValueElem);
    previousValueElem.textContent = `${equationString} = `;
    newNumberFlag = true;
    itemArray = [];
  });
};

document.addEventListener("DOMContentLoaded", initApp);

const calculate = (equation, currentValueElem) => {
  const regex = /(^[*/=])|(\s)/g;
  equation.replace(regex, "");
  const divByZero = /(\/0)/.test(equation);
  if (divByZero) return (currentValueElem.value = 0);
  return (currentValueElem.value = eval(equation));
};

function playAudio() {
  let drop = new Audio("./audio/drop.mp3");
  drop.play();
}
