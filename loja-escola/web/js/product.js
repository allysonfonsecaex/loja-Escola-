const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = window.NEBULA_PRODUCTS.find((item) => item.id === productId);
const productPanel = document.querySelector("#produtoDetalhe");
const unavailablePanel = document.querySelector("#produtoIndisponivel");

if (!product) {
  unavailablePanel.hidden = false;
} else {
  productPanel.hidden = false;
  document.title = `${product.name} | Nébula Miúda`;
  document.querySelector('meta[name="description"]').content = product.shortDescription;
  document.querySelector("#breadcrumbProduto").textContent = product.name;
  document.querySelector("#produtoCategoria").textContent = product.category;
  document.querySelector("#produtoNome").textContent = product.name;
  document.querySelector("#produtoDescricao").textContent = product.description;
  document.querySelector("#produtoRegra").textContent = `Regra da coleção: ${product.rule}`;
  document.querySelector("#produtoPreco").textContent = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(product.price);

  const illustration = document.querySelector("#produtoIlustracao");
  illustration.textContent = product.illustration;
  illustration.setAttribute("aria-label", product.alt);

  const facts = document.querySelector("#produtoFicha");
  product.details.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    facts.append(item);
  });

  document.querySelector("#formProduto").addEventListener("submit", (event) => {
    event.preventDefault();
    const quantityInput = document.querySelector("#quantidade");
    if (!quantityInput.reportValidity()) return;

    sessionStorage.setItem("checkoutItem", JSON.stringify({
      productId: product.id,
      quantity: Number(quantityInput.value)
    }));
    window.location.href = "checkout.html";
  });
}
