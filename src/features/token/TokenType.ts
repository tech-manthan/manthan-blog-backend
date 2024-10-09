import { Schema } from "mongoose";

export interface Token {
  user_id: Schema.Types.ObjectId;
  expire_at: Date;
}
