// Main function call to update links with parameters
const params = getParameters()
if (Object.keys(params).length > 0) {
  updateAllLinksWithParameters(params)
}

// Function to obtain parameters from the URL
function getParameters() {
  const params = {}
  const searchParams = new URLSearchParams(window.location.search)

  searchParams.forEach((value, param) => {
    if (param.startsWith("utm_") || param.startsWith("_")) {
      params[param] = value
    }
  })

  return params
}

// Function to append parameters to a given URL
function appendParameters(url, params) {
  const urlObject = new URL(url)
  for (const [param, value] of Object.entries(params)) {
    urlObject.searchParams.set(param, value)
  }

  return urlObject.toString()
}

// Function to update all links on the page with parameters
function updateAllLinksWithParameters(params) {
  const links = document.getElementsByTagName("a")
  for (let link of links) {
    if (link.getAttribute("href")) {
      link.href = appendParameters(link.href, params)
    }
  }
}
