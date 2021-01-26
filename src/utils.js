const MODE = {
  CREATE: 'create',
  DESTROY: 'destroy'
}

export async function createDatabase (id) {
  return doDbOperation(MODE.CREATE, id)
}

export async function destroyDatabase (id) {
  return doDbOperation(MODE.DESTROY, id)
}

async function doDbOperation (mode, id) {
  if (process.env.PROD) {
    if (process.env.CREATE_DB_URL) {
      try {
        return await fetch(process.env.CREATE_DB_URL, {
          method: mode === MODE.DESTROY ? 'DELETE' : 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
      } catch (e) {
        throw new Error(`Unable to ${mode} database: ${e.toString()}`)
      }
    } else {
      throw new Error('CREATE_DB_URL has not been defined for production use.')
    }
  } else {
    const createFunc = require('./functions/create-database').handler
    return await new Promise((resolve, reject) => {
      createFunc({ body: JSON.stringify({ id }), httpMethod: mode === MODE.DESTROY ? 'DELETE' : 'POST' }, null, function (e, response) {
        if (e) {
          reject(`Unable to ${mode} database: ${e.toString()}`)
        } else {
          resolve(response)
        }
      })
    })
  }
}

export class ExportItem {
  constructor (item) {
    this.color = item.color || 'DEFAULT'
    this.isTrashed = false
    this.isPinned = item.pinned || false
    this.isArchived = item.archived || false
    this.title = item.value.title
    this.userEditedTimestampUsec = item.modified * 1000 // convert to microseconds
    this._id = item._id
    switch (item.type) {
      case 'Checklist':
        if (item.value.items && Array.isArray(item.value.items)) {
          this.listContent = item.value.items.map(item => {
            return {
              text: item.value.label,
              isChecked: item.value.checked
            }
          })
        } else {
          this.listContent = []
        }
        break
      case 'Note':
        this.textContent = item.value.data
        break
    }
  }

  toJSON () {
    const { color, isTrashed, isPinned, isArchived, title, userEditedTimestampUsec, _id, listContent, textContent } = this
    return { color, isTrashed, isPinned, isArchived, title, userEditedTimestampUsec, _id, listContent, textContent }
  }

  toString () {
    return JSON.stringify(this.toJSON())
  }
}

export class ImportItem {
  constructor (item, id) {
    this._id = item._id || id
    this._rev = item._rev
    this.color = item.color || 'DEFAULT'
    this.pinned = item.isPinned || false
    this.archived = item.isArchived || false
    this.modified = item.userEditedTimestampUsec ? new Date(parseFloat(item.userEditedTimestampUsec) / 1000).getTime() : Date.now()
    this.value = {
      title: item.title
    }

    if (item.listContent) {
      this.type = 'Checklist'
      this.value.items = []
      if (Array.isArray(item.listContent)) {
        this.value.items = item.listContent.map(item => {
          return {
            value: {
              checked: item.isChecked,
              label: item.text
            }
          }
        })
      }
    } else {
      this.type = 'Note'
      this.value.data = item.textContent || ''
    }
  }

  toJSON () {
    const { _id, type, color, pinned, archived, modified, value } = this
    return { _id, type, color, pinned, archived, modified, value }
  }

  toString () {
    return JSON.stringify(this.toJSON())
  }
}
