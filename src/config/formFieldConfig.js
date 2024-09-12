// Form fields for sign up for Customer
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

// Form fields for login
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

// Form fields for creating a new daycare api/daycare
export const createDaycareFields = [
  {
    id: "daycare_name",
    label: "Daycare Name",
    type: "text",
    model: "daycare_name",
    required: true,
  },
  {
    id: "street_address",
    label: "Street Address",
    type: "text",
    model: "street_address",
    required: true,
  },
  {
    id: "suburb",
    label: "Suburb",
    type: "text",
    model: "suburb",
    required: true,
  },
  {
    id: "state",
    label: "State",
    type: "select",
    model: "state",
    options: [
      { value: "NSW", text: "New South Wales" },
      { value: "VIC", text: "Victoria" },
      { value: "QLD", text: "Queensland" },
      { value: "SA", text: "South Australia" },
      { value: "WA", text: "Western Australia" },
      { value: "TAS", text: "Tasmania" },
      { value: "NT", text: "Northern Territory" },
      { value: "ACT", text: "Australian Capital Territory" },
    ],
    required: true,
  },
  {
    id: "postcode",
    label: "Postcode",
    type: "text",
    model: "postcode",
    required: true,
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    model: "phone",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    model: "email",
    required: true,
  },

  {
    id: "capacity",
    label: "Capacity",
    type: "number",
    model: "capacity",
    required: true,
  },
  // {
  //   id: "pet_types",
  //   label: "Pet Types",
  //   type: "select",
  //   model: "pet_types",
  //   options: [
  //     { value: 1, text: "Dog" },
  //     { value: 2, text: "Cat" },
  //     { value: 3, text: "Bird" },
  //     { value: 4, text: "Fish" },
  //     { value: 5, text: "Lizard" },
  //   ],
  //   required: false,
  // },
  {
    id: "opening_hours",
    label: "Opening Hours",
    type: "array",
    model: "opening_hours",
    required: false,
    fields: [
      {
        id: "day",
        label: "Day",
        type: "select",
        model: "day",
        options: [
          { value: 1, text: "Monday" },
          { value: 2, text: "Tuesday" },
          { value: 3, text: "Wednesday" },
          { value: 4, text: "Thursday" },
          { value: 5, text: "Friday" },
          { value: 6, text: "Saturday" },
          { value: 7, text: "Sunday" },
        ],
        required: true,
      },
      {
        id: "from_hour",
        label: "From Hour",
        type: "time",
        model: "from_hour",
        required: false,
      },
      {
        id: "to_hour",
        label: "To Hour",
        type: "time",
        model: "to_hour",
        required: false,
      },
      {
        id: "closed",
        label: "Closed",
        type: "checkbox",
        model: "closed",
        required: false,
      },
    ],
  },
];

// Form fields for creating a new employee
export const ownerCreateEmployeeFields = [
  {
    id: "username",
    label: "Username",
    type: "text",
    model: "user.username",
    required: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    model: "user.password",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    model: "user.email",
    required: true,
  },
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    model: "user.first_name",
    required: true,
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    model: "user.last_name",
    required: true,
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    model: "phone",
    required: true,
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    model: "role",
    options: [
      { value: "O", text: "Owner" },
      { value: "E", text: "Employee" },
      // Add other roles if applicable
    ],
    required: true,
  },
  // {
  //   id: "daycare",
  //   label: "Daycare",
  //   type: "select",
  //   model: "daycare",
  //   multiple: true,
  //   options: [
  //     // Populate this with daycare options from your backend or other data source
  //     { value: 1, text: "Daycare 1" },
  //     { value: 2, text: "Daycare 2" },
  //   ],
  //   required: true,
  // },
];

export const addProductFields = [
  {
    id: "name",
    label: "Product Name",
    type: "text",
    model: "name",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    type: "text",
    model: "description",
    required: true,
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    model: "price",
    required: true,
  },
  {
    id: "capacity",
    label: "Capacity",
    type: "number",
    model: "capacity",
    required: true,
  },
];
