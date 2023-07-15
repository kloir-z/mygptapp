const getColor = (role: string) => {
  switch (role) {
    case 'system':
      return 'lightgray';
    case 'user':
      return 'lightblue';
    case 'assistant':
      return 'lightgreen';
    default:
      return 'white';
  }
};

export default getColor;
