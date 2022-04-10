const addPasswordErrors = {
  addName: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 40,
      message: 'Maksymalna długość nazwy to 40 znaków.',
    },
  },
  addPassword: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 50,
      message: 'Maksymalna długość hasła to 50 znaków.',
    },
  },
}

const editPasswordErrors = {
  editName: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 40,
      message: 'Maksymalna długość nazwy to 40 znaków.',
    },
  },
  editPassword: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 50,
      message: 'Maksymalna długość hasła to 50 znaków.',
    },
  },
}

export { addPasswordErrors, editPasswordErrors }
