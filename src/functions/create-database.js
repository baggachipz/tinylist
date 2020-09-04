exports.handler = function(event, context, callback) {
  const fetch = require('node-fetch')
  const data = JSON.parse(event.body)
  const id = data.id

  if (!id) {
    throw new Error('id was not specified in payload')
  }

  let dbUrl = process.env.DB_URL
  const dbUser = process.env.DB_USER,
    dbPass = process.env.DB_PASS

  // make sure things are defined
  if (!dbUrl && !dbUser && !dbPass) throw new Error ('database credentials have not been stored/fetched correctly.')

  // assemble the full db url with credentials, if they already aren't part of it
  if (!dbUrl.includes(dbUser) && !dbUrl.includes(dbPass)) {
    const baseUrl = dbUrl.slice(dbUrl.lastIndexOf('://') + 3)
    dbUrl = dbUrl.replace(':\/\/', `://${dbUser}:${dbPass}@${baseUrl}`)
  }

  // tack the id on, as defined in CouchDB API
  dbUrl = dbUrl + '/' + id

  // call put method to create the new database
  fetch(dbUrl, {
    method: 'PUT'
  }).then(response => {
    if (response.ok) callback(null, {
      statusCode: 200,
      body: id
    })

    switch (response.status) {
      case 412:
        // already created, just return the id
        callback(null, {
          statusCode: 200,
          body: id
        })
      default:
        callback(response.statusText)
    }
  })
}
