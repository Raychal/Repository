const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  let finished = false
  if (pageCount === readPage) {
    finished = true
  }

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.name.toLowerCase().includes(name.toLowerCase()))
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  }

  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.reading === true)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  } else if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.reading === false)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  }

  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.finished === true)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  } else if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.finished === false)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books
        .map((obj) => ({
          id: obj.id,
          name: obj.name,
          publisher: obj.publisher
        }))
    }
  })
  return response
}

const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((b) => b.id === bookId)[0]
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((b) => b.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((n) => n.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
