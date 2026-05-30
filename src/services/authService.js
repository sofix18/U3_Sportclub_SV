// authService.js — Conexión con el backend de SportClub
const API_URL = 'http://localhost:3000/api/auth'
const USERS_URL = 'http://localhost:3000/api/users'

function getToken() {
  return localStorage.getItem('token')
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}

function saveSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function clearSession() {
  const photo = localStorage.getItem('user_photo')
  localStorage.clear()
  if (photo) localStorage.setItem('user_photo', photo)
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
  }
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json()
  if (!res.ok || !data.ok) {
    const err = new Error(data.message || 'Error en la solicitud')
    err.errors = data.errors || {}
    throw err
  }
  return data
}

export async function loginUser(email, password) {
  const data = await apiFetch(`${API_URL}/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password })
  })
  saveSession(data.data.token, data.data.user)
  return data.data.user
}

export async function registerUser(full_name, email, password) {
  return await apiFetch(`${API_URL}/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ full_name, email, password })
  })
}

export async function getMe() {
  const data = await apiFetch(`${API_URL}/me`, { headers: authHeaders() })
  return data.data
}

export async function updateMe(payload) {
  const data = await apiFetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  })
  localStorage.setItem('user', JSON.stringify(data.data))
  return data.data
}

export async function updatePassword(current_password, new_password, confirm_password) {
  return await apiFetch(`${API_URL}/me/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ current_password, new_password, confirm_password })
  })
}

export async function getUsers() {
  const data = await apiFetch(USERS_URL, { headers: authHeaders() })
  return data.data
}

export async function createUser(payload) {
  const data = await apiFetch(USERS_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  })
  return data.data
}

export async function updateUser(id, payload) {
  const data = await apiFetch(`${USERS_URL}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  })
  return data.data
}

export async function deleteUser(id) {
  return await apiFetch(`${USERS_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
}

export { getToken, getUser, clearSession }
