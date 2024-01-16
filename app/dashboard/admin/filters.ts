export const filters = [
  {
    id: 'licenses',
    name: 'Licenses',
    options: [
      { value: 'white', label: 'All', checked: false },
      { value: 'blue', label: 'Active', checked: true },
      { value: 'blue', label: 'Expired', checked: true },
      { value: 'white', label: 'Guest', checked: false },
    ],
  },
  {
    id: 'job',
    name: 'Job Functions',
    options: [
      { value: 'new-arrivals', label: 'All', checked: true },
      { value: 'new-arrivals', label: 'Manager', checked: false },
      { value: 'sale', label: 'Maitenance', checked: false },
      { value: 'travel', label: 'Machinest', checked: false },
      { value: 'organization', label: 'Engineer', checked: false },
      { value: 'accessories', label: 'Technician', checked: false },
    ],
  },
  {
    id: 'location',
    name: 'Location',
    options: [
      { value: '2l', label: 'All', checked: true },
      { value: '6l', label: 'Hamilton', checked: false },
      { value: '6l', label: 'Regina', checked: false },
    ],
  },
]