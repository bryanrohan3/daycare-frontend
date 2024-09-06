// src/config/formFieldsConfig.js
export const signUpFormField = [
  {
    id: "username",
    label: "Username",
    type: "text",
    model: "username",
    required: true,
  },
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    model: "first_name",
    row: true,
    required: true,
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    model: "last_name",
    row: true,
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    model: "email",
    row: true,
    required: true,
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    model: "phone",
    row: true,
    required: true,
  },
];

export const loginFormFields = [
  {
    id: "username",
    label: "Username",
    type: "text",
    model: "username",
    required: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    model: "password",
    required: true,
  },
];
