// db.ts

export interface User {
    id: number;
    name: string;
  }
  
  const users: User[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ];
  
  export const getUser = (id: number): User | undefined => {
    return users.find((user) => user.id === id);
  };
  