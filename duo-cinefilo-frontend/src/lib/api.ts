export async function fetchMovies() {
  const res = await fetch("http://127.0.0.1:8000/api/peliculas/");
  if (!res.ok) throw new Error("Error al obtener películas");
  return await res.json();
}
