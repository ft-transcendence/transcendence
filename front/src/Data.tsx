let users = [
    {
        username: "anonymous",
        name: "Jane",
        surname: "Doe",
        wins: 10,
        loses: 3,
        rank: 80,
        id: 64565
    },
    {
        username: "louloose",
        name: "Lou",
        surname: "Valdes",
        wins: 85,
        loses: 90,
        rank: 10,
        id: 445
    },
    {
        username: "best_bg",
        name: "Florian",
        surname: "Cavillon",
        wins: 100,
        loses: 3,
        rank: 1,
        id: 2575
    },
  ];
  
  export function getUsers() {
    return users;
  }

  export function getUser(id: number) {
    return users.find(
      (user) => user.id === id
    );
  }