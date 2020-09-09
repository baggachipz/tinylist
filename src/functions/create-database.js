exports.handler = function (event, context, callback) {
  const fetch = require('node-fetch')
  const data = JSON.parse(event.body)
  const id = data.id

  const bToA = (typeof btoa === 'undefined') ? btoaShim : btoa

  if (!id) {
    throw new Error('id was not specified in payload')
  }

  let dbUrl = process.env.DB_URL
  const dbUser = process.env.DB_USER,
    dbPass = process.env.DB_PASS,
    dbPort = process.env.DB_PORT || 6984

  // make sure things are defined
  if (!dbUrl && !dbUser && !dbPass) throw new Error('database credentials have not been stored/fetched correctly.')

  // add port to url
  dbUrl += ':' + dbPort

  // tack the id on, as defined in CouchDB API
  dbUrl = dbUrl + '/' + id

  // call put method to create the new database
  fetch(dbUrl, {
    method: 'PUT',
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    headers: {
      'Content-Type': 'text/plain',
      Authorization: 'Basic ' + bToA(`${dbUser}:${dbPass}`)
    }
  }).then(response => {
    if (response.ok) {
      callback(null, {
        statusCode: 200,
        body: id
      })
    }

    switch (response.status) {
      case 412:
        // already created, just return the id
        callback(null, {
          statusCode: 200,
          body: id
        })
        break
      default:
        callback(response.statusText)
    }
  })
}

function btoaShim (str) {
  var buffer

  if (str instanceof Buffer) {
    buffer = str
  } else {
    buffer = Buffer.from(str.toString(), 'binary')
  }

  return buffer.toString('base64')
}
