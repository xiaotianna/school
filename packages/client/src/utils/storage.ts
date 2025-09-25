export const getStorage = (
  key: string,
  storageType: 'local' | 'session' = 'local'
) => {
  try {
    if (storageType === 'local') {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } else {
      const value = sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export const setStorage = (
  key: string,
  value: any,
  storageType: 'local' | 'session' = 'local'
) => {
  if (storageType === 'local') {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}

export const removeStorage = (
  key: string,
  storageType: 'local' | 'session' = 'local'
) => {
  if (storageType === 'local') {
    localStorage.removeItem(key)
  } else {
    sessionStorage.removeItem(key)
  }
}
