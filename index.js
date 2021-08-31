const cartItem = document.querySelector(".shopping");
const notification = document.querySelector(".shopping-cart");
const donHang = document.querySelector(".co-hang");
const noneItem = document.querySelector(".none-item");
const menuBtn = document.querySelector(".menu-container");
const menuBar = document.querySelector(".show-menu");
const backBtn = document.querySelector(".back-btn");
const productWrapper = document.querySelector(".product__container");
const notiCard = document.querySelector(".added-noti");
const notiText = document.querySelector(".noti-text");
const increaseBtn = document.querySelector(".increase-item");
const decreaseBtn = document.querySelector(".decrease-item");
const itemNum = document.querySelector(".item-num");
const addToCartBtn = document.querySelector(".add-to-cart-on-view");
const viewCart = document.querySelector(".bill-button");
const saveBtn = document.querySelector(".save-btn");
const continueBtn = document.querySelector(".continue-btn");
const cart = document.querySelector(".view-cart");
const listProduct = document.querySelector(".list-item");
let storageProduct = localStorage.getItem("totalProduct");
let totalProduct = {};
if (storageProduct) {
    [totalProduct] = JSON.parse(localStorage["totalProduct"]);
    listProduct.innerHTML = localStorage.getItem("listItem");
    let deleteBtn = document.getElementsByClassName("delete-btn");
    for (let btn of deleteBtn) {
        btn.onclick = handleDelete;
    }
}

let data = [];
const applyBtn = document.querySelector(".apply-btn");
const resultCode = document.querySelector(".result-code");
const code = document.querySelector(".promode-code");
window.onload = init;
function init() {
    increaseBtn.onclick = handleIncrease;
    decreaseBtn.onclick = handleDecrease;
    addToCartBtn.onclick = handleAdd;
    menuBtn.onclick = () => {
        menuBar.classList.toggle("show-menu-active");
        menuBtn.classList.toggle("menu-container-active");
        let showMenu = document.querySelector(".show-menu-active");
        if (showMenu) {
            menuBtn.innerHTML = `<i class="fa fa-times"></i><span>Back</span>`;
        } else {
            menuBtn.innerHTML = `<i class="fas fa-bars"></i><span>Menu</span>`;
        }
    }
    backBtn.onclick = () => {
        menuBar.classList.remove("show-menu-active");
        menuBtn.classList.remove("menu-container-active");
        menuBtn.innerHTML = `<i class="fas fa-bars"></i><span>Menu</span>`;
    }
    cartItem.onmouseover = () => {
        notification.classList.add("shopping-cart-active");
    }
    cartItem.onmouseout = () => {
        notification.classList.remove("shopping-cart-active");
    }
    viewCart.onclick = handleViewCart;
    continueBtn.onclick = () => {
        cart.classList.remove("view-cart-active");
    }
    saveBtn.onclick = handleSave;
    applyBtn.onclick = handleCode;
    code.onkeypress = (e) => {
        if (e.keyCode == 13) {
            applyBtn.click();
        }
    }
    handleProduct();
}
async function handleProduct() {
    let response = await fetch("furniture.json");
    data = await response.json();
    data.sort((a, b) => a.category < b.category ? -1 : a.category > b.category ? 1 : 0);
    data.forEach((key, index) => key.id = index);
    showItem(data);
}
function showItem(data) {
    for (let i = 0; i < data.length; i++) {
        let card = document.createElement("div");
        card.classList.add("product__card");
        let item = `
        <div class="product__card-img">
            <img src="${data[i].imgSrc}" alt="">
            <div class="cart-item">
                <button class="search-product" id="image-${data[i].id}">
                <i class="fa fa-eye" id="img-${data[i].id}"></i>
                </button>
                <button id = ${data[i].id} class="add-to-cart">
                <i class="fa fa-shopping-bag" id="i-${data[i].id}"></i>
                </button>

            </div>
        </div>
        <div class="product__card-content">
            <p class="product-name" data-text="${data[i].name} - ${data[i].category}">${data[i].name} - ${data[i].category}</p>
            <p>$${data[i].price}</p>
        </div>
        `;
        card.innerHTML = item;
        productWrapper.appendChild(card);
    }
    let listItem = document.querySelectorAll(".add-to-cart");
    let viewItemList = document.querySelectorAll(".search-product");
    for (let i = 0; i < listItem.length; i++) {
        listItem[i].onclick = handleCart;
    }
    viewItemList.forEach(item => item.onclick = viewProduct);
    checkNoti()
}
function checkNoti() {
    let itemList = Object.keys(totalProduct);
    let valueList = Object.values(totalProduct);
    let currentItem = document.querySelector(".cart-title");
    let noti = document.querySelector(".amount-notification");
    if (valueList.length > 0) {
        let total = valueList.reduce((a, b) => a + b);
        noti.innerHTML = total;
    } else noti.innerHTML = 0;
    if (itemList.length > 0) {
        donHang.classList.add("co-hang-active");
        noneItem.classList.remove("none-item-active");
        let totalBill = document.querySelector(".total-money");
        let total = 0;
        for (let key in totalProduct) {
            total += data[key].price * totalProduct[key];
        }
        totalBill.innerHTML = `Total: $${total.toFixed(2)}`;
        currentItem.innerHTML = `You have ${itemList.length} items in your shopping bag`
    } else {
        donHang.classList.remove("co-hang-active");
        noneItem.classList.add("none-item-active");
    }
    storageTotalProduct();
}
function handleCart(e) {
    let element = e.target;
    let id = element.id;
    if (isNaN(parseFloat(id))) {
        id = id.split("-")[1];
    }
    notiCard.classList.add("added-noti-active");
    notiText.innerHTML = `${data[id].name} has been added to your cart`
    setTimeout(() => {
        notiCard.classList.remove("added-noti-active");
    }, 3000);
    showNotiList(id);
}
let exitBtn = document.querySelector(".exit-btn");
function viewProduct(e) {
    let element = e.target;
    let id = element.id;
    if (isNaN(parseFloat(id))) {
        id = id.split("-")[1];
    }
    let image = document.querySelector(".image");
    let name = document.querySelector(".name");
    let price = document.querySelector(".price");
    let view = document.querySelector(".view-product");
    let exitBtn = document.querySelector(".exit-btn");
    image.src = data[id].imgSrc;
    name.innerHTML = data[id].name;
    price.innerHTML = `$${data[id].price}`;
    view.classList.add("view-product-active");
    exitBtn.onclick = () => {
        view.classList.remove("view-product-active");
        itemNum.value = 1;
    }
    addToCartBtn.id = `add-${id}`;
}
function showNotiList(id) {
    if (totalProduct.hasOwnProperty(id) == false) {
        totalProduct[id] = 1;
        let product = document.createElement("div");
        product.classList.add("info-item");
        product.setAttribute("id", `info-item-${id}`)
        let item = `
            <img src="${data[id].imgSrc}" alt="">
            <div class="product-information"
            <p class="item-name">${data[id].name}</p>
            <p> Price: $${data[id].price} </p>
            </div>
            <p class="amount-item" id="total-${id}">x${totalProduct[id]}</p>
            <i class="fa fa-trash delete-btn" id="deletenoti-${id}">
            `
        product.innerHTML = item;
        listProduct.appendChild(product);
    } else {
        totalProduct[id]++;
        let totalId = document.getElementById(`total-${id}`);
        totalId.innerHTML = `x${totalProduct[id]}`;
    }
    let deleteBtn = document.getElementsByClassName("delete-btn");
    for (let btn of deleteBtn) {
        btn.onclick = handleDelete;
    }
    checkNoti();

}
function handleDelete(e) {
    let id = e.target.id;
    id = id.split("-")[1]
    let item = document.querySelector(`#info-item-${id}`)
    item.remove();
    delete totalProduct[id];
    checkNoti();
}
function handleIncrease() {
    if (itemNum.value <= 0 || itemNum.value == "") {
        itemNum.value = 1;
    } else
    itemNum.value++;
}
function handleDecrease() {
    if (itemNum.value > 1 || itemNum.value == "") {
        itemNum.value--;
    }
    else itemNum.value = 1;
}
function handleAdd(e) {
    let element = e.target;
    let id = element.id;
    id = id.split("-")[1];
    if (isNaN(parseFloat(itemNum.value)) || itemNum.value % 1 != 0 || itemNum.value < 0) {
        alert("Please check your order again")
        return false;
    }
    notiCard.classList.add("added-noti-active");
    notiText.innerHTML = `${data[id].name} has been added to your cart`
    setTimeout(() => {
        notiCard.classList.remove("added-noti-active");
    }, 4000);
    showNotiList2(id);
    exitBtn.click();
}
function showNotiList2(id) {
    if (totalProduct.hasOwnProperty(id) == false) {
        totalProduct[id] = parseFloat(itemNum.value);
        let product = document.createElement("div");
        product.classList.add("info-item");
        product.setAttribute("id", `info-item-${id}`)
        let item = `
            <img src="${data[id].imgSrc}" alt="">
            <div class="product-information"
            <p class="item-name">${data[id].name}</p>
            <p> Price: $${data[id].price} </p>
            </div>
            <p class="amount-item" id="total-${id}">x${totalProduct[id]}</p>
            <i class="fa fa-trash delete-btn" id="deletenoti-${id}">
            `
        product.innerHTML = item;
        listProduct.appendChild(product);
    } else {
        totalProduct[id] += parseFloat(itemNum.value);
        let totalId = document.getElementById(`total-${id}`);
        totalId.innerHTML = `x${totalProduct[id]}`;
    }
    let deleteBtn = document.getElementsByClassName("delete-btn");
    for (let btn of deleteBtn) {
        btn.onclick = handleDelete;
    }
    checkNoti();
}
function handleViewCart() {
    let cart = document.querySelector(".view-cart");
    showCart();
    cart.classList.add("view-cart-active");

}
const itemAmount = document.querySelector(".item-amount");
const itemAmountSumary = document.querySelector(".item-sumary");
const totalSumary = document.querySelector(".sumary-price");
const totalBillCart = document.querySelector(".total-bill");
const shippingFee = document.querySelector(".shipping-fee");
let fee = 0;
function showCart() {
    let itemList = Object.keys(totalProduct);
    if (itemList.length > 1) {
        itemAmount.innerHTML = `${itemList.length} items`
        itemAmountSumary.innerHTML = `Items ${itemList.length} `
    } else {
        itemAmount.innerHTML = "1 item";
        itemAmountSumary.innerHTML = `Item 1`
    }

    let total = 0;
    for (let key in totalProduct) {
        total += data[key].price * totalProduct[key];
    }
    checkCart(total);
    creatCart();
}
function creatCart() {
    let itemList = document.querySelectorAll(".info-item");
    itemList = Array.from(itemList);
    itemList = itemList.map(item => item.id.split("-")[2]);
    let cartWrapper = document.querySelector(".cart__container-product");
    let item = "";
    for (let key of itemList) {
        item += `
        <div class="product__info" id="product__info-${key}">
                        <div class="product-details">
                            <img src="${data[key].imgSrc}" alt="">
                            <p>${data[key].name} <span>${data[key].price}</span></p>
                        </div>
                        <div class="product-quantity">
                            <button class="decrease" id="decrease-${key}">-</button><input type="number" id="quantity-${key}" value="${totalProduct[key]}"
                                class="num"><button class="increase" id="increase-${key}">+</button>
                        </div>
                        <div class="product-price">
                            $${data[key].price}
                        </div>
                        <div class="product-total">
                            <p id="totalEach-${key}">$${(data[key].price * totalProduct[key]).toFixed(2)}</p>
                            <i class="fa fa-trash trash-in-cart" id="delete-${key}"></i>
                        </div>
                    </div>
        `
    }
    cartWrapper.innerHTML = item;
    let trashList = document.querySelectorAll(".trash-in-cart");
    trashList.forEach(a => a.onclick = handleTrashCart)
    let increaseList = document.querySelectorAll(".increase");
    let decreaseList = document.querySelectorAll(".decrease");
    let inputValue = document.querySelectorAll(".num");
    inputValue.forEach(btn => btn.onchange = handleInputValue);
    increaseList.forEach(btn => btn.onclick = handleIncreaseCart);
    decreaseList.forEach(btn => btn.onclick = handleDecreaseCart);
    code.value = "";
    resultCode.innerHTML = "";
}
function handleTrashCart(e) {
    let element = e.target;
    let id = element.id.split("-")[1];
    let product = document.querySelector(`#product__info-${id}`);
    let currentAmount = itemAmount.innerHTML.split(" ")[0];
    let price = parseFloat(data[id].price);
    code.value = "";
    resultCode.innerHTML = "";
    if (currentAmount < 3) {
        itemAmount.innerHTML = `${currentAmount - 1} item`
        itemAmountSumary.innerHTML = `Item ${currentAmount - 1}`;
    } else {
        itemAmount.innerHTML = `${currentAmount - 1} items`;
        itemAmountSumary.innerHTML = `Items ${currentAmount - 1}`;
    }
    let amount = parseFloat(document.querySelector(`#quantity-${id}`).value);
    let sumaryTotalBefore = parseFloat(totalSumary.innerHTML.split("$")[1]);
    let totalCurrent = 0;
    if (amount == 0) {
        let totalThisProduct = parseFloat(document.querySelector(`#totalEach-${id}`).innerHTML.split("$")[1]);
        totalCurrent = sumaryTotalBefore - totalThisProduct;
    } else {
        totalCurrent = sumaryTotalBefore - amount * price;
    }
    product.remove();
    checkCart(totalCurrent);

}

function handleIncreaseCart(e) {
    let element = e.target;
    let id = element.id.split("-")[1];
    let num = document.querySelector(`#quantity-${id}`);
    let price = parseFloat(data[id].price);
    code.value = ""
    resultCode.innerHTML = "";
    let currentSumary = parseFloat(totalSumary.innerHTML.split("$")[1]);
    let totalThis = document.querySelector(`#totalEach-${id}`);
    if (isNaN(parseFloat(num.value)) || num.value % 1 != 0 || num < 0) {
        num.value = parseFloat(document.querySelector(`#totalEach-${id}`).innerHTML.split("$")[1])/price + 1;
    } else num.value++;
    let thisBill = parseFloat(totalThis.innerHTML.split("$")[1]) + price;
    totalThis.innerHTML = `$${thisBill.toFixed(2)}`;
    currentSumary += price;
    checkCart(currentSumary)
}
function handleDecreaseCart(e) {
    let element = e.target;
    let id = element.id.split("-")[1];
    let num = document.querySelector(`#quantity-${id}`);
    let price = parseFloat(data[id].price);
    code.value = ""
    resultCode.innerHTML = "";
    if (isNaN(parseFloat(num.value)) || num.value % 1 != 0 || num < 0) {
        num.value = parseFloat(document.querySelector(`#totalEach-${id}`).innerHTML.split("$")[1])/price - 1;
    }
    else if (num.value > 1) {
        num.value--;
        
    } else if (num.value == 1) {
        document.querySelector(`#delete-${id}`).click();
        return false;
    }
    let currentSumary = parseFloat(totalSumary.innerHTML.split("$")[1]);
        let totalThis = document.querySelector(`#totalEach-${id}`);
        let thisBill = totalThis.innerHTML.split("$")[1] - price;
        totalThis.innerHTML = `$${thisBill.toFixed(2)}`
        currentSumary -= price;
        checkCart(currentSumary);

}
function checkCart(total) {
    if (total > 50) {
        fee = 0;
        shippingFee.innerHTML = `<span class="fee-before">$5.00</span>$0.00`;
    } else if (total == 0) {
        shippingFee.innerHTML = "$0.00"
    } else {
        fee = 5;
        shippingFee.innerHTML = `$5.00`;
    }
    totalBillCart.innerHTML = `$${(total + fee).toFixed(2)}`;
    totalSumary.innerHTML = `$${total.toFixed(2)}`;
}
function handleSave() {
    let productList = [];
    let amountEach = [];
    let totalProductArr = []
    let itemList = document.querySelectorAll(".product__info");
    itemList.forEach(item => productList.push((item.id.split("-")[1])));
    let valueItem = document.querySelectorAll(".num");
    valueItem.forEach(item => amountEach.push(parseFloat(item.value)));
    for (let i = 0; i < productList.length; i++) {
        totalProductArr.push([productList[i], amountEach[i]]);
    }
    let newTotalProduct = Object.fromEntries(totalProductArr);
    for (let product in totalProduct) {
        if (newTotalProduct.hasOwnProperty(product) == false) {
            let item = document.querySelector(`#deletenoti-${product}`);
            item.click();
        } else {
            let totalId = document.querySelector(`#total-${product}`);
            let amount = document.querySelector(`#quantity-${product}`)
            totalId.innerHTML = `x${amount.value}`
        }
    }
    totalProduct = newTotalProduct;
    checkNoti();
    cart.classList.remove("view-cart-active");
}
function handleInputValue(e) {
    let element = e.target;
    let id = element.id.split("-")[1];
    let price = parseFloat(data[id].price);
    let totalThis = document.querySelector(`#totalEach-${id}`);
    let currentThis = parseFloat(totalThis.innerHTML.split("$")[1]);
    let amount = element.value;
    if (isNaN(parseFloat(amount)) || amount < 0 || amount % 1 != 0) {
        alert("Please enter a valid number")
        element.value = currentThis/price;
        return false;   
    } else if (amount == 0) {
        document.querySelector(`#delete-${id}`).click();
        return false;
    } else {
    let currentSumary = parseFloat(totalSumary.innerHTML.split("$")[1]);
    let newBill = price * amount;
    currentSumary = currentSumary - currentThis + newBill;
    totalThis.innerHTML = `$${newBill.toFixed(2)}`;
    checkCart(currentSumary);
    }
}



function handleCode() {
    let currentSumary = parseFloat(totalSumary.innerHTML.split("$")[1]);
    if (code.value == "nguyetcute") {
        let totalAfter = currentSumary - 50;
        if (currentSumary >= 100) {
            shippingFee.innerHTML = `$5.00`;
            totalBillCart.innerHTML = `<span class="total-before">$${currentSumary.toFixed(2)}</span>$${(totalAfter + 5.00).toFixed(2)}`;
            resultCode.innerHTML = `You got a great deal`
        } else {
            resultCode.innerHTML = `Your bill have to greater than $100 to apply this code`;
            checkCart(currentSumary);
        }
    }
    else {
        resultCode.innerHTML = `You entered an incorrect code`;
        checkCart(currentSumary)
    }
}
function storageTotalProduct() {
    localStorage["totalProduct"] = JSON.stringify([totalProduct]);
    localStorage["listItem"] = listProduct.innerHTML;
}