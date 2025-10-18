// Declare userManager and updateUserDisplay variables
let userManager
let updateUserDisplay

window.onload = () => {
  userManager = window.userManager // Assuming userManager is globally available through window object
  updateUserDisplay = () => {
    const user = userManager.getCurrentUser()
    document.getElementById("name").value = user.name
    document.getElementById("email").value = user.email
  }

  const user = userManager.getCurrentUser()

  if (!user) {
    window.location.href = "../block/login.html"
  } else {
    // Load user data
    document.getElementById("name").value = user.name
    document.getElementById("email").value = user.email

    // Profile form
    const profileForm = document.getElementById("profileForm")
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const newPassword = document.getElementById("newPassword").value
      const formError = document.getElementById("formError")
      const formSuccess = document.getElementById("formSuccess")

      // Check if email is taken by another user
      const existingUser = userManager.findUser(email)
      if (existingUser && existingUser.email !== user.email) {
        formError.textContent = "Email already in use"
        formError.classList.add("active")
        formSuccess.classList.remove("active")
        return
      }

      const updates = { name, email }
      if (newPassword) {
        updates.password = newPassword
      }

      userManager.updateUser(user.email, updates)

      formError.classList.remove("active")
      formSuccess.textContent = "Profile updated successfully!"
      formSuccess.classList.add("active")

      updateUserDisplay()
    })

    // Logout
    const logoutBtn = document.getElementById("logoutBtn")
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      userManager.logout()
      window.location.href = "../index.html"
    })
  }
}
