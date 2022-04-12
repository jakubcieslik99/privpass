const registerErrors = {
  registerEmail: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    maxLength: {
      value: 60,
      message: 'Maksymalna długość adresu email to 60 znaków.',
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Niepoprawny format adresu email.',
    },
  },
  registerCode: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    pattern: {
      value: /^[0-9a-zA-Z]{4,5}$/,
      message: 'Niepoprawny format kodu.',
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.toUpperCase()
      if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4)
    },
  },
}

const loginErrors = {
  loginEmail: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    maxLength: {
      value: 60,
      message: 'Maksymalna długość adresu email to 60 znaków.',
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Niepoprawny format adresu email.',
    },
  },
  loginCode: {
    required: {
      value: true,
      message: 'Pole wymagane.',
    },
    pattern: {
      value: /^[0-9a-zA-Z]{4,5}$/,
      message: 'Niepoprawny format kodu.',
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.toUpperCase()
      if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4)
    },
  },
}

export { registerErrors, loginErrors }
