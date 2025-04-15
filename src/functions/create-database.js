exports.handler = function (event, context, callback) {
  const fetch = require('node-fetch')
  const data = JSON.parse(event.body)
  const id = data.id
  const verb = event.httpMethod === 'DELETE' ? 'DELETE' : 'PUT' // delete or create only; default to create

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
    method: verb,
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    headers: {
      'Content-Type': 'text/plain',
      Authorization: 'Basic ' + bToA(`${dbUser}:${dbPass}`)
    }
  }).then(response => {
    if (response.ok) {
      if (verb === 'DELETE') {
        return callback(null, {
          statusCode: 200,
          body: id
        })
      } else {
        // clear permissions
        return fetch(`${dbUrl}/_security`, {
          method: 'PUT',
          credentials: 'same-origin',
          redirect: 'follow',
          agent: null,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + bToA(`${dbUser}:${dbPass}`)
          },
          body: JSON.stringify({
            admins: {
              names: [],
              roles: []
            },
            members: {
              names: [],
              roles: []
            }
          })
        }).then(
          response => {
            if (!response.ok) {
              console.log('Could not clear database permissions')
            }

            return callback(null, {
              statusCode: 200,
              body: id
            })
          }
        )
      }
    }

    // already created, just return the id
    if (response.status === 412) {
      return callback(null, {
        statusCode: 200,
        body: id
      })
    }
    return callback(response.statusText)
  })
}

function btoaShim (str) {
  let buffer

  if (str instanceof Buffer) {
    buffer = str
  } else {
    buffer = Buffer.from(str.toString(), 'binary')
  }

  return buffer.toString('base64')
}
