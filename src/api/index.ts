import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  author: string;
}

export interface Contact {
  id: number;
  name: string;
  first: string;
  last: string;
  image: string;
  expanded: boolean;
  guid: string;
  integer: number;
  date: string;
  shortText: string;
  mediumText: string;
  longText: string;
  city: string;
  state: string;
  zip: number;
  email: string;
  phone: string;
  color: string;
}

export async function fetchPosts(id?: number): Promise<Post[]> {
  let url = 'http://localhost:5001/posts';
  if (id) {
    url = `${url}/${id}`;
  }

  const response = await axios.get(url, {});
  return response.data as Post[];
}

export async function fetchContacts(): Promise<Contact[]> {
  let url = 'http://localhost:5001/contacts';
  const response = await axios.get(url, {});
  return <Contact[]>response.data;
}

export async function fetchContactById(id: string): Promise<Contact> {
  let url = 'http://localhost:5001/contacts';
  url = `${url}/${id}`;
  const response = await axios.get(url, {});
  return <Contact>response.data;
}
