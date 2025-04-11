import request, { Response } from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/projectService";
import { projects, users } from "../../src/types/prisma";
import { prisma } from "../../src/configs/prisma";

const prismaMock = jest.mocked(prisma);
jest.mock("../../src/services/projectService");

describe("project controller suite", () => {
  const user: users = {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };
  const project: projects = {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    userId: faker.database.mongodbObjectId(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };

  afterAll(() => jest.clearAllMocks());

  test("create project request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "createProject").mockResolvedValue(project);

    const res: Response = await request(app)
      .post("/projects")
      .send({ ...project })
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.createProject).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("project created successfully");
    expect(res.body.data).toBeDefined();
  });

  test("get projects request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "getProjects").mockResolvedValue({
      projects: [project, project] as unknown as [],
      pages: 100,
    });

    const res: Response = await request(app)
      .get("/projects")
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`)
      .query({ page: "1", limit: "10" });

    expect(service.getProjects).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.pages).toBeDefined();
  });

  test("get project by id request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "getProject").mockResolvedValue(project);

    const res: Response = await request(app)
      .get(`/projects/${project.id}`)
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.getProject).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });

  test("update project request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    const newDes = faker.commerce.productDescription();
    jest.spyOn(service, "updateProject").mockResolvedValue(project);

    const res: Response = await request(app)
      .put(`/projects/${project.id}`)
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`)
      .send({
        description: newDes,
      });

    expect(service.updateProject).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("project updated successfully");
  });

  test("delete project request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "deleteProject").mockResolvedValue(project);

    const res: Response = await request(app)
      .delete(`/projects/${project.id}`)
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.deleteProject).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
