var timer = setInterval(removeBranding, 1)
function removeBranding() {
  const element = document.getElementById("__framer-badge-container")
  if (element) {
    element.remove()
  }
}
