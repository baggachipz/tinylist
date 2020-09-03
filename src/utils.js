export async function createDatabase (id) {
  if (process.env.PROD) {
    if (process.env.CREATE_DB_URL) {
      try {
        return await fetch(process.env.CREATE_DB_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
      } catch (e) {
        throw new Error('Unable to create database: ' + e.toString())
      }
    } else {
      throw new Error('CREATE_DB_URL has not been defined for production use.')
    }
  } else {
    return 'No database creation necessary in dev mode.'
  }
}
