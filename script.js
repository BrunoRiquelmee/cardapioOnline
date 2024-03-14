const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkOutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

//array da lista
let cart = [];

//Abrir modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar modal quando cllickar fora
cartModal.addEventListener("click", function(event){
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

//Fechar modal com botao
closeModalBtn.addEventListener("click", function(){
        cartModal.style.display = "none"
})

//Adicionar no carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

        if(parentButton) {
            const name = parentButton.getAttribute("data-name")
            const price = parseFloat(parentButton.getAttribute("data-price"))

            //Add no carrinho
            addToCart(name, price)

        }

})

//Function para add no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    
        if (existingItem){
            //se o item ja existir aumenta apenas a quantidade +1
            existingItem.quantity += 1;
        
        }else {

            cart.push({
                name,
                price,
                quantity: 1,
            })

        }

    updateCartModal()
}


//att o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            
            <button class="remove-btn" data-name="${item.name}">Remover</button>
            
        </div>
    `

    total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

//function para remover item do carriinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")
        
        removeitemCart(name);
    }
})

//function botao remover
function removeitemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart [index]
        
        if (item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index,  1);
        updateCartModal();

    }
}

//adress input
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    
})


//finalizar pedido
checkOutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
    }).showToast();
    return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //ENVIAR PEDIDO PRA API DO ZAP
    const cartItems = cart.map((item) => {
        return (
           ` ${item.name} Quantidade: (${item.quantity}) Preço:R$${item.price} |` 
        )
    }).join("")

    const message = encodeURIComponent(cartItems + ` Valor total:${cartTotal.textContent}`);
    const phone = "+5588998404876"
    

    window.open(`https://wa.me/${phone}?text=${message} | Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal();

})

//function de verificar o horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 23; 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
