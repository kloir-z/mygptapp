const getColor = (role: string) => {
  switch (role) {
    case 'system':
      return 'lightgray';
    case 'user':
      return '#c1d5ff';
    case 'assistant':
      return '#bbdebb';
    default:
      return 'white';
  }
};

export default getColor;
