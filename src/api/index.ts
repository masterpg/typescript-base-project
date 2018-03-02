import axios from 'axios';

export async function getPosts(id?: number): Promise<Post[]> {
  let url = 'http://localhost:5001/posts';
  if (id) {
    url = `${url}/${id}`;
  }

  const response = await axios.get(url, {});
  return response.data as Post[];
}

export interface Post {
  id: number;
  title: string;
  author: string;
}