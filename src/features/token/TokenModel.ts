import mongoose, { Schema } from "mongoose";
import { Token } from "./TokenType";

const tokenSchema = new Schema<Token>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    expire_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const TokenModel = mongoose.model("token", tokenSchema);

export default TokenModel;
