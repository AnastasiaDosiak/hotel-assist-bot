import { Feedback } from "../../backend/models/Feedback";
import { v4 as uuidv4 } from "uuid";

export const saveFeedback = async (
  rating: string,
  fullName: string,
  comment: string,
) => {
  try {
    await Feedback.create({
      id: uuidv4(),
      estimation: Number(rating),
      fullName: fullName || null,
      comment,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }
};
