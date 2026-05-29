// Store simple para compartir el avatar entre componentes
const listeners = new Set()
 
export function subscribeAvatar(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
 
export function setAvatarGlobal(base64) {
  if (base64) localStorage.setItem('user_photo', base64)
  else localStorage.removeItem('user_photo')
  listeners.forEach(fn => fn(base64))
}
 
export function getAvatarGlobal() {
  return localStorage.getItem('user_photo')
}
