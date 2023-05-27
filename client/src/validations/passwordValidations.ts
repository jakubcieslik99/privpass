const addPasswordErrors = {
  addName: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    maxLength: {
      value: 40,
      message: 'validationErrorNameLength',
    },
  },
  addPassword: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    maxLength: {
      value: 60,
      message: 'validationErrorPasswordLength',
    },
  },
}

const editPasswordErrors = {
  editName: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    maxLength: {
      value: 40,
      message: 'validationErrorNameLength',
    },
  },
  editPassword: {
    required: {
      value: true,
      message: 'validationErrorRequired',
    },
    maxLength: {
      value: 60,
      message: 'validationErrorPasswordLength',
    },
  },
}

export { addPasswordErrors, editPasswordErrors }
