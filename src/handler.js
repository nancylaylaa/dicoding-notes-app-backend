// nanoid: library pihak ketiga untuk membuat properti id(string dan harus unik)
// import nanoid dari package
const {nanoid} = require('nanoid');
// impor array notes
const notes = require('./notes');

// CREATE: method membuat note baru
const addNoteHandler = (request, h) => {
  // Client mengirim data catatan (title, tags, dan body)
  // disimpan dalam bentuk JSON melalui body request
  // server mengambil body request menggunakan properti request.payload
  const {title, tags, body} = request.payload;

  // memanggil method nanoid()
  // mengisi parameter number(ukuran dari string-nya)
  const id = nanoid(16);

  /* menambahkan catatan baru == properti createdAt dan updatedAt
  seharusnya sama*/
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // struktur objek notes
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };
  // masukan nilai-nilai tersebut ke dalam array notes
  notes.push(newNote);

  // memastikan newNote sudah masuk ke dalam array notes
  // method filter() berdasarkan id catatan
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  // respon berhasil
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  // respon gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// READ: method menampilkan semua note
// tidak perlu menuliskan parameter request dan h karena ia tidak digunakan
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// method menampilkan note tertentu
const getNoteByIdHandler = (request, h) => {
  // menentukan id note
  const {id} = request.params;

  // mendapatkan objek note dengan id tersebut dari objek array notes
  const note = notes.filter((n) => n.id === id)[0];

  // mendapatkan id, objek note tidak bernilai undefined
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  // mendapatkan id, objek note bernilai undefined
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// UPDATE: mengubah note
const editNoteByIdHandler = (request, h) => {
  // menentukan id note
  const {id} = request.params;

  // dapatkan data notes terbaru dari client melalui body request
  const {title, tags, body} = request.payload;

  // memperbarui properte updateAt
  const updatedAt = new Date().toISOString();

  // dapatkan dulu index array pada objek catatan sesuai id yang ditentukan
  const index = notes.findIndex((note) => note.id === id);

  // id ditemukan, index bernilai array index dari objek catatan yang dicari
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // // id tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// DELETE: menghapus note
const deleteNoteByIdHandler = (request, h) => {
  // menentukan id note
  const {id} = request.params;

  // dapatkan index dari objek catatan sesuai dengan id yang didapat
  const index = notes.findIndex((note) => note.id === id);

  // id ditemukan
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // id gagal ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};