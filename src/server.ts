function welcome(name: string): string {
  const user = {
    name: "Devendra",
  };
  const url = user.name;
  return `Welcome, ${name} (${url})!`;
}

welcome("Devendra");
