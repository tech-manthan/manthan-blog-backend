import { Schema } from "mongoose";

export interface Blog {
  blog_id: string;
  title: string;
  banner: string;
  des: string;
  content: [];
  tags: Array<string>;
  author: Schema.Types.ObjectId;
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  comments: Array<Schema.Types.ObjectId>;
  draft: boolean;
}
