const registerErrors = {
  registerEmail: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    maxLength: {
      value: 60,
      message: 'validationErrorEmailLength',
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'validationErrorEmailFormat',
    },
  },
  registerCode: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    pattern: {
      value: /^[0-9a-zA-Z]{4,5}$/,
      message: 'validationErrorCodeFormat',
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
      message: 'validationErrorRequired',
    },
    maxLength: {
      value: 60,
      message: 'validationErrorEmailLength',
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'validationErrorEmailFormat',
    },
  },
  loginCode: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    pattern: {
      value: /^[0-9a-zA-Z]{4,5}$/,
      message: 'validationErrorCodeFormat',
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.toUpperCase()
      if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4)
    },
  },
}

export { registerErrors, loginErrors }
