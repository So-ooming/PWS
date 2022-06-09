const Category_name = document.querySelector(".Category_name"),
Category_Color = document.querySelector(".Category_Color"),
ToDoList_name = document.querySelector(".ToDoList_name"),
ToDoList_time = document.querySelector(".ToDoList_time"),
ToDoList_Category = document.querySelector(".ToDoList_Category");

const addBtn = document.querySelector(".addBtn"),
  submitBtn = document.querySelector(".submitBtn"),
  cancelBtn = document.querySelector(".cancelBtn"),
  inputBox = document.querySelector(".inputBox"),
  contentForm = document.querySelector(".content_form"),
  inputText = contentForm.querySelector("input"),
  inputPrice = document.querySelector(".inputPrice"),
  select = document.querySelector(".select"),
  totalPriceText = document.querySelector(".total"),
  incomeText = document.querySelector(".income_money"),
  expenseText = document.querySelector(".expense_money"),
  incomeMenu = document.getElementById("incomeMenu"),
  expenseMenu = document.getElementById("expenseMenu"),
  CategoryList = document.querySelector(".CategoryList"),
  expenseBtn = document.querySelector(".expenseBtn"),
  basicMenu = document.getElementById("basicMenu"),
  incomeBtn = document.querySelector(".incomeBtn"),
  clearMenu = document.getElementById("clearMenu");

let CategoryArr = [];

function getCategoryObj(name, color) {
  return {
    name: name,
    color: color,
  };
}

function saveCategory(Category) {
  CategoryArr.push(Category);
}

function deleteCategory(e) {
  const btn = e.target.parentNode;
  const div = btn.parentNode;
  const li = div.parentNode;
  CategoryList.removeChild(li);

  CategoryArr = CategoryArr.filter(function (item) {
    return item.id !== li.id;
  });

  saveLS();
  updatePrice();
}

function saveLS() {
  localStorage.setItem("Category", JSON.stringify(CategoryArr));
}

function paintCategory(Category) {
  const addValueBox = document.createElement("div");
  const li = document.createElement("li");
  const delBtnSpan = document.createElement("button");
  const selectSpan = document.createElement("span");
  const textSpan = document.createElement("text");
  const priceSpan = document.createElement("price");

  addValueBox.id = "addValueBox";
  textSpan.id = "text";
  priceSpan.id = "price";
  selectSpan.id = "select";
  delBtnSpan.id = "delBtn";
  delBtnSpan.innerHTML = `<i class="far fa-trash-alt"></i>`;
  delBtnSpan.addEventListener("click", deleteCategory);

  li.id = Category.id;

  addValueBox.appendChild(selectSpan);
  addValueBox.appendChild(textSpan);
  addValueBox.appendChild(priceSpan);
  addValueBox.appendChild(delBtnSpan);
  li.appendChild(addValueBox);
  CategoryList.appendChild(li);

  if (Category.price < 0) {
    priceSpan.classList.add("red");
    priceSpan.innerText = `${Category.price}원`;
  } else {
    priceSpan.classList.add("green");
    priceSpan.innerText = `+${Category.price}원`;
  }

  selectSpan.innerText = `${Category.select}`;
  textSpan.innerText = `${Category.text}`;
}

function submitBtnClick() {
  const CategoryNameValue = Category_name.value;
  const textValue = inputText.value;
  let priceValue = inputPrice.value;

  if (priceValue.trim() === "") {
    alert("가격을 입력하세요.");
  }

  if (expenseBtn.checked === true) {
    if (priceValue > 0) {
      priceValue = priceValue * -1;
    }
  }

  inputText.value = "";
  inputPrice.value = "";

  const CategoryObj = getCategoryObj(CategoryNameValue, textValue, priceValue);
  paintCategory(CategoryObj);
  saveCategory(CategoryObj);
  saveLS();

  inputBox.classList.add("hide");
  addBtn.classList.remove("hide");
  inputBox.classList.remove("showingInputBox");

  updatePrice();
}

function loadLS() {
  CategoryArr = JSON.parse(localStorage.getItem("Category")) || [];
}

function restoreState() {
  CategoryArr.forEach(function (item) {
    paintCategory(item);
  });
}

function updatePrice() {
  // 수입, 지출, 총 금액 계산하고 화면에 출력
  const price = CategoryArr.map((item) => Number(item.price));
  const totalPrice = price.reduce((acc, cur) => (acc += cur), 0);
  const income = price
    .filter((price) => price > 0)
    .reduce((acc, cur) => (acc += cur), 0);
  const expense = price
    .filter((price) => price < 0)
    .reduce((acc, cur) => (acc += cur), 0);

  incomeText.innerText = `${income}`;
  expenseText.innerText = `${expense}`;
  totalPriceText.innerText = `${totalPrice}`;
}

function cancelBtnClick() {
  inputBox.classList.remove("showingInputBox");
  addBtn.classList.remove("hide"); //inputBox를 안보이게, addBtn을 보이게 해줌
  inputText.value = "";
  inputPrice.value = "";
}

function addBtnClick() {
  inputBox.classList.remove("hide");
  inputBox.classList.add("showingInputBox"); //inputBox가 보이게 해줌
  addBtn.classList.add("hide"); // add버튼이 안보이게 해줌
}

function displayExpense() {
  //지출만 보여주기
  const expenseArr = CategoryArr.filter((item) => item.price < 0);
  CategoryList.innerHTML = "";

  for (let i = 0; i < expenseArr.length; i++) {
    const li = document.createElement("li");
    const valueBoxHTML = `
    <div id="addValueBox">
        <span id="select">${expenseArr[i].select}</span>
        <span id="text">${expenseArr[i].text}</span>
        <span id="price" style="color:red">${expenseArr[i].price}원</span>
    </div>
    `;
    li.innerHTML = valueBoxHTML;
    CategoryList.appendChild(li);
  }
}

function displayIncome() {
  // 수입만 보여주기
  const incomeArr = CategoryArr.filter((item) => item.price > 0);
  CategoryList.innerHTML = "";

  for (let i = 0; i < incomeArr.length; i++) {
    const li = document.createElement("li");
    const valueBoxHTML = `
    <div id="addValueBox">
        <span id="select">${incomeArr[i].select}</span>
        <span id="text">${incomeArr[i].text}</span>
        <span id="price" style="color:green">+${incomeArr[i].price}원</span>
        
    </div>
    `;

    //<button id="delBtn" onclick="deleteCategory()"><i class="far fa-trash-alt"></i></button>

    li.innerHTML = valueBoxHTML;
    CategoryList.appendChild(li);
  }
}

function clearCategory() {
  // 모두 삭제하기
  CategoryList.innerHTML = "";
  localStorage.clear();
  incomeText.innerText = `0`;
  expenseText.innerText = `0`;
  totalPriceText.innerText = `0`;
  CategoryArr = [];
}

function showAllCategory() {
  // 전체 보여주기
  location.reload(true);
}

function handleEvent() {
  addBtn.addEventListener("click", addBtnClick);
  submitBtn.addEventListener("click", submitBtnClick);
  cancelBtn.addEventListener("click", cancelBtnClick);
  incomeMenu.addEventListener("click", displayIncome);
  expenseMenu.addEventListener("click", displayExpense);
  clearMenu.addEventListener("click", clearCategory);
  basicMenu.addEventListener("click", showAllCategory);
}
function init() {
  handleEvent();
  loadLS();
  restoreState();
  updatePrice();
}

init();