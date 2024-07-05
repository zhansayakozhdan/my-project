export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Event Finder',
      route: '/search',
    },
    {
      label: 'About',
      route: '#/about',
    },
  ]
  
  export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
  }