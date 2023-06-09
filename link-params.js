const onlyExternalLinks = true
const storageName = "params"
const storageDuration = 30 // days
const defaultPromoCode = getPromoCodeFromElement("promo_code")
const storedParams = getStoredParameters()
const urlParams = getURLParameters()
const params = {}
if (defaultPromoCode) {
  params.prefilled_promo_code = defaultPromoCode
}
Object.assign(params, storedParams, urlParams)
if (Object.keys(params).length > 0) {
  storeParameters(params)
  updateAllLinksWithParameters(params)
}

function getStoredParameters() {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(storageName))
  if (cookie) {
    const cookieParams = JSON.parse(cookie.split("=")[1])
    if (typeof cookieParams === "object") {
      return cookieParams
    }
  }
}

function getURLParameters() {
  const params = {}
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.forEach((value, param) => {
    if (param.startsWith("_") || param.startsWith("utm_") || ["ref", "source", "prefilled_promo_code"].includes(param)) {
      params[param] = value
    }
  })
  Object.keys(params).forEach((param) => {
    if (param.startsWith("_utm_")) {
      params[param.slice(1)] = params[param]
    }
  })
  return params
}

function getPromoCodeFromElement(elementId) {
  const element = document.getElementById(elementId)
  const pElement = element?.querySelector("p")
  return pElement ? pElement?.innerText : ""
}

function storeParameters(params) {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + storageDuration)
  document.cookie = `${storageName}=${JSON.stringify(params)}; expires=${expiration.toUTCString()}; path=/`
}

function updateAllLinksWithParameters(params) {
  const links = document.getElementsByTagName("a")
  for (let link of links) {
    if (link.getAttribute("href")) {
      link.href = appendParameters(link.href, params)
    }
  }
}

function appendParameters(url, params) {
  const urlObject = new URL(url)
  if (onlyExternalLinks && urlObject.hostname === window.location.hostname) {
    return urlObject.toString()
  }
  for (const [param, value] of Object.entries(params)) {
    if (!urlObject.searchParams.has(param)) {
      urlObject.searchParams.set(param, value)
    }
  }
  return urlObject.toString()
}
