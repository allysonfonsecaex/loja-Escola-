const productList = document.querySelector("#listaProdutos");
const searchInput = document.querySelector("#filtroProduto");
const categoryFilter = document.querySelector("#filtroCategoria");
const sortSelect = document.querySelector("#ordenacao");
const filterStatus = document.querySelector("#mensagemFiltro");
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function createProductCard(product) {
  const column = document.createElement("article");
  column.className = "col-sm-6 col-xl-3 product-item";

  const card = document.createElement("div");
  card.className = "product-card h-100";

  const artwork = document.createElement("div");
  artwork.className = "product-art";
  artwork.setAttribute("role", "img");
  artwork.setAttribute("aria-label", product.alt);
  artwork.textContent = product.illustration;

  const body = document.createElement("div");
  body.className = "product-card-body";
  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;
  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;
  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.shortDescription;
  const rule = document.createElement("p");
  rule.className = "product-rule";
  rule.textContent = product.rule;
  const footer = document.createElement("div");
  footer.className = "product-card-footer";
  const price = document.createElement("p");
  price.className = "price mb-0";
  price.textContent = currency.format(product.price);
  const link = document.createElement("a");
  link.className = "btn btn-outline-dark";
  link.href = `produto.html?id=${encodeURIComponent(product.id)}`;
  link.textContent = "Descobrir";
  link.setAttribute("aria-label", `Descobrir ${product.name}`);

  footer.append(price, link);
  body.append(category, name, description, rule, footer);
  card.append(artwork, body);
  column.append(card);
  return column;
}

function populateCategories() {
  const categories = [...new Set(window.NEBULA_PRODUCTS.map((product) => product.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const category = categoryFilter.value;
  const sortBy = sortSelect.value;
  let matches = window.NEBULA_PRODUCTS.filter((product) => {
    const searchable = `${product.name} ${product.category} ${product.shortDescription} ${product.rule}`.toLocaleLowerCase("pt-BR");
    return searchable.includes(searchTerm) && (!category || product.category === category);
  });

  if (sortBy === "name") matches = matches.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  if (sortBy === "price-asc") matches = matches.slice().sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") matches = matches.slice().sort((a, b) => b.price - a.price);

  productList.replaceChildren(...matches.map(createProductCard));
  filterStatus.textContent = matches.length
    ? `${matches.length} ${matches.length === 1 ? "invenção encontrada" : "invenções encontradas"}.`
    : "Nenhuma invenção encontrada. Tente outra busca ou categoria.";
}

populateCategories();
[searchInput, categoryFilter, sortSelect].forEach((control) => control.addEventListener("input", renderProducts));
renderProducts();
