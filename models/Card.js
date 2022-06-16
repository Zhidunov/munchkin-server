import mongoose from "mongoose";

const Card = new mongoose.Schema({
  name: { type: "string", required: true },
  description: { type: "string", required: false },
  type: { type: "string", required: true },
  price: { type: "number", required: false },
  bonus: { type: "number", required: false },
  is_big: { type: "boolean", required: false },
  is_rotated: { type: "boolean", required: false },
  is_selected: { type: "boolean", required: false },
  slot: { type: "string", required: false },
  related_cards: { type: "array", required: false },
  image_src: { type: "string", required: true },
});

export default mongoose.model("Card", Card);
