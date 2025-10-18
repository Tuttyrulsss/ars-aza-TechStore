// Declare productManager and cartManager variables
const productManager = window.productManager
const cartManager = window.cartManager

const urlParams = new URLSearchParams(window.location.search)
const productId = urlParams.get("id")

if (productId) {
  const product = productManager.getProduct(productId)

  if (product) {
    const productDetail = document.getElementById("productDetail")

    productDetail.innerHTML = `
            <div class="product-detail-content">
                <div class="product-detail-image">${product.image}</div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <div class="product-rating">${"⭐".repeat(Math.floor(product.rating))} ${product.rating}</div>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-description">${product.description}</div>
                    <button class="btn-primary" id="addToCartBtn">Add to Cart</button>
                </div>
            </div>
        `

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      cartManager.addToCart(product)
      alert("Product added to cart!")
    })
  } else {
    document.getElementById("productDetail").innerHTML = "<h2>Product not found</h2>"
  }
} else {
  document.getElementById("productDetail").innerHTML = "<h2>Product not found</h2>"
}
