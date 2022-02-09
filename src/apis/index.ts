export async function createBookmark(userId) {
  const res = await fetch(
    `https://pickabook-server-develop.herokuapp.com/bookmark/${userId}`
  );
  const data = res.json();
  return data;
}
