let users = [];

const addUser = (u) => {
  const name = u.name.trim().toLowerCase();
  const room = u.room.trim().toLowerCase();

  const existingUser = users.find(
    (user) =>
      user.room.trim().toLowerCase() === room &&
      user.name.trim().toLowerCase() === name
  );

  !existingUser && users.push(u);
  return { existingUser: !!existingUser, user: u };
};

const getRoomUsers = (room) => users.filter((e) => e.room === room);

const removeUser = (u) => {
  const name = u.name.trim().toLowerCase();
  const room = u.room.trim().toLowerCase();

  const existingUser = users.find(
    (user) =>
      user.room.trim().toLowerCase() === room &&
      user.name.trim().toLowerCase() === name
  );

  if (existingUser) {
    users = users.filter((user) => user.name.trim().toLowerCase() !== name);
  }
  return existingUser;
};

module.exports = { addUser, getRoomUsers, removeUser };
