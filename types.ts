// interface Comment { 
//   id: string;
//   content: string;
//   author_name: string;
//   pub_date: string;
// }

// interface Post {
//   post_id: string;
//   author_id: string;
//   title: string;
//   content: string;
//   author_name: string;
//   image_url: string;
//   pub_date: string;
//   slug: string;
//   comments: Comment[];
// }

interface User {
  first_name: string;
  username: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface Count {
  ratings: number;
  comments: number;
}

interface EditorJSBlock {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface SubTopicContent {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

interface SubTopic {
  id: string;
  post_id: string;
  created_at: string;
  updated_at: string;
  subtopic_header: string;
  content: SubTopicContent;
  is_premium: boolean;
  price: number;
}

interface Post {
  id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  summary: string;
  image_banner: string;
  read_time: number;
  total_price: number;
  is_one_price: boolean;
  categories: Category[];
  user: User;
  count: Count;
  sub_topics: SubTopic[];
}

interface PostResponse {
  status: string;
  message: string;
  data: Post[];
}
