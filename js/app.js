// Catalog menu toggle
const catalogBtn = document.getElementById("catalogBtn")
const catalogMenu = document.getElementById("catalogMenu")

if (catalogBtn && catalogMenu) {
  catalogBtn.addEventListener("click", () => {
    catalogMenu.classList.toggle("active")
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!catalogMenu.contains(e.target) && !catalogBtn.contains(e.target)) {
      catalogMenu.classList.remove("active")
    }
  })
}

// Banner carousel
const carousel = document.getElementById("bannerCarousel")
if (carousel) {
  const slides = carousel.querySelectorAll(".banner-slide")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const dotsContainer = document.getElementById("carouselDots")

  let currentSlide = 0

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div")
    dot.className = `carousel-dot ${index === 0 ? "active" : ""}`
    dot.addEventListener("click", () => goToSlide(index))
    dotsContainer.appendChild(dot)
  })

  const dots = dotsContainer.querySelectorAll(".carousel-dot")

  function goToSlide(n) {
    slides[currentSlide].classList.remove("active")
    dots[currentSlide].classList.remove("active")

    currentSlide = (n + slides.length) % slides.length

    slides[currentSlide].classList.add("active")
    dots[currentSlide].classList.add("active")
  }

  function nextSlide() {
    goToSlide(currentSlide + 1)
  }

  function prevSlide() {
    goToSlide(currentSlide - 1)
  }

  prevBtn.addEventListener("click", prevSlide)
  nextBtn.addEventListener("click", nextSlide)

  // Auto-advance every 2 seconds
  setInterval(nextSlide, 2000)
}

// Load products on home page
const productsGrid = document.getElementById("productsGrid")
if (productsGrid) {
  const prods = window.productManager.getProducts().slice(0, 8)

  productsGrid.innerHTML = prods
    .map(
      (product) => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="product-image">${product.image}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">${"⭐".repeat(Math.floor(product.rating))} ${product.rating}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">$${product.price}</div>
        </div>
    `,
    )
    .join("")
}

// Search functionality
const searchInput = document.getElementById("searchInput")
if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim()
      if (query) {
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`
      }
    }
  })
}
