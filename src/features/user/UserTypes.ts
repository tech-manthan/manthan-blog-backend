import { Schema } from "mongoose";

export interface User {
  personal_info: {
    fullname: string;
    email: string;
    password: string;
    username: string;
    bio: string;
    profile_img: string;
  };
  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    website: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  role: string;
  social_auth: boolean;
  blogs: Array<Schema.Types.ObjectId>;
}
