import { jest } from "@jest/globals";

// ---- Mock prisma (src/config/database.js) ----
const prismaMock = {
  question: {
    findUnique: jest.fn(),
  },
  answer: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

// This path matches how controllers import it: "../config/database.js"
jest.unstable_mockModule("../src/config/database.js", () => ({
  __esModule: true,
  default: prismaMock,
}));

// ---- Mock notification service ----
const createNotification = jest.fn();

jest.unstable_mockModule("../src/services/notificationService.js", () => ({
  __esModule: true,
  createNotification,
}));

// ---- Import the controller AFTER mocks ----
const {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
} = await import("../src/controllers/answerController.js");

// Small helper to build res object
const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("answerController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createAnswer", () => {
    it("returns 400 if content or questionId is missing", async () => {
      const req = {
        body: { content: "", questionId: null },
        user: { id: "user-1" },
      };
      const res = createRes();

      await createAnswer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Content and questionId are required",
      });
      expect(prismaMock.answer.create).not.toHaveBeenCalled();
    });

    it("returns 404 if question does not exist", async () => {
      const req = {
        body: { content: "test", questionId: "q-1" },
        user: { id: "user-1" },
      };
      const res = createRes();

      prismaMock.question.findUnique.mockResolvedValue(null);

      await createAnswer(req, res);

      expect(prismaMock.question.findUnique).toHaveBeenCalledWith({
        where: { id: "q-1" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Question not found" });
    });

    it("creates answer and notification when data is valid", async () => {
      const req = {
        body: { content: "My answer", questionId: "q-1" },
        user: { id: "author-1" },
      };
      const res = createRes();

      prismaMock.question.findUnique.mockResolvedValue({
        id: "q-1",
        authorId: "question-owner",
      });

      const newAnswer = {
        id: "a-1",
        content: "My answer",
        questionId: "q-1",
        authorId: "author-1",
      };
      prismaMock.answer.create.mockResolvedValue(newAnswer);

      await createAnswer(req, res);

      expect(prismaMock.answer.create).toHaveBeenCalledWith({
        data: {
          content: "My answer",
          questionId: "q-1",
          authorId: "author-1",
        },
      });

      expect(createNotification).toHaveBeenCalledWith({
        userId: "question-owner",
        actorId: "author-1",
        type: "NEW_ANSWER",
        questionId: "q-1",
        answerId: "a-1",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newAnswer);
    });
  });

  describe("updateAnswer", () => {
    it("returns 403 if a different user tries to update", async () => {
      const req = {
        params: { id: "a-1" },
        body: { content: "updated" },
        user: { id: "other-user" },
      };
      const res = createRes();

      prismaMock.answer.findUnique.mockResolvedValue({
        id: "a-1",
        authorId: "owner-user",
      });

      await updateAnswer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "You are not authorized to update this answer",
      });
      expect(prismaMock.answer.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteAnswer", () => {
    it("returns 404 if answer does not exist", async () => {
      const req = {
        params: { id: "a-404" },
        user: { id: "u-1" },
      };
      const res = createRes();

      prismaMock.answer.findUnique.mockResolvedValue(null);

      await deleteAnswer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Answer not found",
      });
    });
  });

  describe("acceptAnswer", () => {
    it("returns 403 if caller is not the question author", async () => {
      const req = {
        params: { id: "a-1" },
        user: { id: "not-owner" },
      };
      const res = createRes();

      prismaMock.answer.findUnique.mockResolvedValue({
        id: "a-1",
        authorId: "answer-author",
        questionId: "q-1",
        question: {
          id: "q-1",
          authorId: "real-owner",
        },
      });

      await acceptAnswer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only the question author can accept an answer",
      });
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });
  });
});
