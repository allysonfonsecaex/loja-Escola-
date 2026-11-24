const form = document.querySelector("#checkoutForm");
const cepInput = document.querySelector("#cep");
const searchCepButton = document.querySelector("#buscarCep");
const cepFeedback = document.querySelector("#cepFeedback");
const quantityInput = document.querySelector("#quantidadePedido");
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

let checkoutItem;
try {
  checkoutItem = JSON.parse(sessionStorage.getItem("checkoutItem"));
} catch (error) {
  console.error("Não foi possível ler o item salvo para o checkout.", error);
}

const product = checkoutItem && window.NEBULA_PRODUCTS.find((item) => item.id === checkoutItem.productId);
if (!product || !Number.isInteger(checkoutItem.quantity) || checkoutItem.quantity < 1 || checkoutItem.quantity > 10) {
  window.location.replace("index.html");
} else {
  quantityInput.value = String(checkoutItem.quantity);
  renderSummary();
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function cursorAfterDigitCount(value, digitCount) {
  if (!digitCount) return value.startsWith("(") ? 1 : 0;
  let count = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) count += 1;
    if (count === digitCount) return index + 1;
  }
  return value.length;
}

function formatCep(value) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function showCepMessage(message, state) {
  cepFeedback.textContent = message;
  cepFeedback.className = `mt-3 mb-0 feedback-${state}`;
}

function renderSummary() {
  const quantity = Number(quantityInput.value);
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10;
  quantityInput.setCustomValidity(validQuantity ? "" : "Escolha uma quantidade entre 1 e 10.");
  if (!validQuantity) return;

  const subtotal = product.price * quantity;
  const shipping = subtotal >= 300 ? 0 : 18;
  const summary = document.querySelector("#itemResumo");
  summary.replaceChildren();

  const name = document.createElement("p");
  name.className = "summary-name";
  name.textContent = product.name;
  const rule = document.createElement("p");
  rule.className = "small text-secondary";
  rule.textContent = product.rule;
  summary.append(name, rule);
  document.querySelector("#subtotalPedido").textContent = currency.format(subtotal);
  document.querySelector("#fretePedido").textContent = shipping ? currency.format(shipping) : "Grátis";
  document.querySelector("#totalPedido").textContent = currency.format(subtotal + shipping);
}

async function lookupCep() {
  const digits = onlyDigits(cepInput.value);
  cepInput.setCustomValidity(digits.length === 8 ? "" : "Digite um CEP com oito números.");
  if (digits.length !== 8) {
    showCepMessage("Digite um CEP com oito números antes de buscar.", "error");
    cepInput.focus();
    return;
  }

  searchCepButton.disabled = true;
  showCepMessage("Consultando o endereço...", "loading");
  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok) throw new Error(`A consulta retornou o status ${response.status}.`);
    const address = await response.json();
    if (!address || typeof address !== "object" || address.erro) {
      showCepMessage("Não encontramos esse CEP. Confira os números e tente novamente.", "error");
      return;
    }

    const fields = [
      ["logradouro", address.logradouro],
      ["bairro", address.bairro],
      ["cidade", address.localidade],
      ["estado", address.uf]
    ];
    let fieldsFound = 0;
    fields.forEach(([id, value]) => {
      if (typeof value === "string" && value.trim()) {
        document.querySelector(`#${id}`).value = value;
        fieldsFound += 1;
      }
    });
    showCepMessage(
      fieldsFound ? "Endereço preenchido. Confira os dados e complete o número." : "O CEP foi localizado, mas não trouxe dados de endereço. Preencha-os manualmente.",
      fieldsFound ? "success" : "error"
    );
  } catch (error) {
    console.error("Falha ao consultar o ViaCEP.", error);
    showCepMessage("Não foi possível consultar o CEP agora. Verifique a conexão ou preencha o endereço manualmente.", "error");
  } finally {
    searchCepButton.disabled = false;
  }
}

cepInput.addEventListener("input", () => {
  const digitsBeforeCursor = onlyDigits(cepInput.value.slice(0, cepInput.selectionStart)).length;
  cepInput.value = formatCep(cepInput.value);
  const cursorPosition = cursorAfterDigitCount(cepInput.value, digitsBeforeCursor);
  cepInput.setSelectionRange(cursorPosition, cursorPosition);
  cepInput.setCustomValidity("");
  if (cepFeedback.textContent) showCepMessage("", "");
});
searchCepButton.addEventListener("click", lookupCep);
quantityInput.addEventListener("input", renderSummary);

document.querySelector("#telefone").addEventListener("input", (event) => {
  const digitsBeforeCursor = onlyDigits(event.target.value.slice(0, event.target.selectionStart)).length;
  const digits = onlyDigits(event.target.value).slice(0, 11);
  if (digits.length <= 2) {
    event.target.value = digits ? `(${digits}` : "";
  } else if (digits.length <= 6) {
    event.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    event.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    event.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  const cursorPosition = cursorAfterDigitCount(event.target.value, digitsBeforeCursor);
  event.target.setSelectionRange(cursorPosition, cursorPosition);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  cepInput.setCustomValidity(onlyDigits(cepInput.value).length === 8 ? "" : "Informe um CEP com oito números.");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    form.querySelector(":invalid")?.focus();
    return;
  }

  const subtotal = product.price * Number(quantityInput.value);
  const shipping = subtotal >= 300 ? 0 : 18;
  const completedOrder = {
    number: `NEB-${Math.floor(100000 + Math.random() * 900000)}`,
    productId: product.id,
    quantity: Number(quantityInput.value),
    total: subtotal + shipping,
    customerName: document.querySelector("#nome").value.trim()
  };
  sessionStorage.setItem("completedOrder", JSON.stringify(completedOrder));
  window.location.href = "sucesso.html";
});
