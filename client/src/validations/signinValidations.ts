const registerErrors = {
  registerEmail: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 50,
      message: 'Maksymalna długość adresu email to 50 znaków.',
    },
  },
  registerCode: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 4,
      message: 'Maksymalna długość kodu to 4 znaki.',
    },
  },
}

const loginErrors = {
  loginEmail: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 50,
      message: 'Maksymalna długość adresu email to 50 znaków.',
    },
  },
  loginCode: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 4,
      message: 'Maksymalna długość kodu to 4 znaki.',
    },
  },
}

export { registerErrors, loginErrors }
