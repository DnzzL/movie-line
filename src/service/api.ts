import imdb from 'imdb-api';
const axios = require('axios').default;

export async function fetchSubtitles(
  imdbId: string,
  language: string,
  replica: string
) {
  try {
    const response = await axios.post('http://localhost:8000/subtitles', {
      imdbId,
      language,
      replica,
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not get subtitles');
  }
}

export async function fetchMovieTitles(
  title: string
): Promise<imdb.SearchResults> {
  try {
    const response = await axios.post('http://localhost:8000/movies', {
      title,
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not get movies');
  }
}
