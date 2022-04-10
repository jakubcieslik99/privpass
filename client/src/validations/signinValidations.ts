const registerFirstErrors = {
  registerEmail: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 50,
      message: 'Maksymalna długość adresu email to 50 znaków.',
    },
  },
}
const registerSecondErrors = {
  registerCode: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 4,
      message: 'Maksymalna długość kodu to 4 znaki.',
    },
  },
}

const loginFirstErrors = {
  loginEmail: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 50,
      message: 'Maksymalna długość adresu email to 50 znaków.',
    },
  },
}
const loginSecondErrors = {
  loginCode: {
    required: 'Pole wymagane.',
    maxLength: {
      value: 4,
      message: 'Maksymalna długość kodu to 4 znaki.',
    },
  },
}

export { registerFirstErrors, registerSecondErrors, loginFirstErrors, loginSecondErrors }
