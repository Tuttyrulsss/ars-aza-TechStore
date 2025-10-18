// Declare userManager variable
const userManager = window.userManager // Assuming userManager is available globally from data.js

// Login form
const loginForm = document.getElementById("loginForm")
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const formError = document.getElementById("formError")

    const user = userManager.findUser(email)

    if (!user || user.password !== password) {
      formError.textContent = "Invalid email or password"
      formError.classList.add("active")
      return
    }

    if (user.blocked) {
      formError.textContent = "Your account has been blocked"
      formError.classList.add("active")
      return
    }

    userManager.setCurrentUser(user)
    window.location.href = "index.html"
  })
}

// Register form
const registerForm = document.getElementById("registerForm")
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const formError = document.getElementById("formError")

    if (password !== confirmPassword) {
      formError.textContent = "Passwords do not match"
      formError.classList.add("active")
      return
    }

    if (userManager.findUser(email)) {
      formError.textContent = "Email already registered"
      formError.classList.add("active")
      return
    }

    const user = {
      name,
      email,
      password,
      blocked: false,
      isAdmin: false,
    }

    userManager.addUser(user)
    userManager.setCurrentUser(user)

    window.location.href = "index.html"
  })
}
