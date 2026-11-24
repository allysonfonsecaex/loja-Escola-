let order;
try {
  order = JSON.parse(sessionStorage.getItem("completedOrder"));
} catch (error) {
  console.error("Não foi possível ler o pedido concluído.", error);
}

const product = order && window.NEBULA_PRODUCTS.find((item) => item.id === order.productId);
if (!product || !Number.isInteger(order.quantity) || typeof order.total !== "number") {
  window.location.replace("index.html");
} else {
  document.querySelector("#mensagemCliente").textContent = `${order.customerName}, sua compra foi concluída. Foi uma viagem e tanto!`;
  document.querySelector("#numeroPedido").textContent = order.number;
  document.querySelector("#produtoPedido").textContent = product.name;
  document.querySelector("#quantidadePedido").textContent = String(order.quantity);
  document.querySelector("#totalPedido").textContent = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(order.total);
}
