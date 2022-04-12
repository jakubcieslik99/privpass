const addPasswordErrors = {
  addName: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    maxLength: {
      value: 40,
      message: 'Maksymalna długość nazwy to 40 znaków.',
    },
  },
  addPassword: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    maxLength: {
      value: 50,
      message: 'Maksymalna długość hasła to 50 znaków.',
    },
  },
}

const editPasswordErrors = {
  editName: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    maxLength: {
      value: 40,
      message: 'Maksymalna długość nazwy to 40 znaków.',
    },
  },
  editPassword: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    maxLength: {
      value: 50,
      message: 'Maksymalna długość hasła to 50 znaków.',
    },
  },
}

export { addPasswordErrors, editPasswordErrors }
