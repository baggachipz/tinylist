exports.handler = async (event) => {
  const fetch = require('node-fetch')
  return event
  const id = event.id

  if (!id) {
    throw new Error('id was not specified in payload')
  }

  const dbUrl = process.env.DB_URL,
    dbUser = process.env.DB_USER,
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
  const response = await fetch(dbUrl, {
    method: 'PUT'
  })
  
  if (response.ok) return id

  switch (response.status) {
    case 412:
      // already created, just return the id
      return id
    default:
      throw new Error(response.statusText)
  }
}
