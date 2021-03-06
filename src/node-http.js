const httpGet = (uri, encoding = 'utf8') => {
  let data = ''
  let status = -1
  try {
    const url = new URL(uri)
    const XMLHttpRequest = require('unxhr').XMLHttpRequest
    const xhr = new XMLHttpRequest()
    if (url.username && url.password) {
      xhr.open('GET', `${url.protocol}//${url.host}${url.pathname}`, false, url.username, url.password)
    } else {
      xhr.open('GET', `${url.protocol}//${url.host}${url.pathname}`, false)
    }
    if (encoding === 'binary') {
      xhr.responseType = 'arraybuffer'
    }
    xhr.addEventListener('load', function () {
      status = this.status
      if (status === 200) {
        if (encoding === 'binary') {
          const arrayBuffer = xhr.response
          const byteArray = new Uint8Array(arrayBuffer)
          for (let i = 0; i < byteArray.byteLength; i++) {
            data += String.fromCharCode(byteArray[i])
          }
        } else {
          data = this.responseText
        }
      }
    })
    xhr.send()
  } catch (e) {
    throw new Error(`Error reading file: ${uri}; reason: ${e.message}`)
  }
  // assume that no data means it doesn't exist
  if (status === 404 || !data) {
    throw new Error(`No such file: ${uri}`)
  }
  return data
}

module.exports = {
  get: httpGet
}
