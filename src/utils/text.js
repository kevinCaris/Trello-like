
// Tronquer texte
export function truncateText(text, length = 50) {
  if (!text) return ""
  return text.length > length ? text.substring(0, length) + "…" : text
}

// Nettoyer HTML
export function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "")
}

// Mettre la première lettre en majuscule
export function capitalize(str = "") {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

//Décode les html entries
export function decodeHtml(text){
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, "text/html")
  return doc.documentElement.textContent
}