import * as service from "../../src/services/projectService";
import { Project } from "../../src/models/Project";
import agenda from "../../src/configs/agenda";
import { faker } from "@faker-js/faker";
import { ProjectModel } from "../../src/types/schemas";
import { Types } from "mongoose";
import { User } from "../../src/models/User";

jest.mock("../../src/models/Project");
jest.mock("../../src/models/User");
jest.mock("../../src/configs/agenda");

describe("project service testing", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const project: ProjectModel = {
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    userId: new Types.ObjectId(faker.database.mongodbObjectId()),
  };

  afterEach(() => jest.clearAllMocks());

  test("create new project test", async () => {
    Project.create = jest.fn().mockResolvedValue(project);
    jest.spyOn(User, "updateOne");

    await service.createProject(project);

    expect(Project.create).toHaveBeenCalledWith(project);
    expect(User.updateOne).toHaveBeenCalled();
  });

  test("get all projects test", async () => {
    Project.find = jest.fn();

    await service.getProjects(id);

    expect(Project.find).toHaveBeenCalledWith({ userId: id });
  });

  test.skip("get project data", async () => {
    Project.findById = jest.fn().mockResolvedValue(project);

    const projectGet: ProjectModel | undefined = await service.getProject(id);

    expect(Project.findById).toHaveBeenLastCalledWith(id);
    expect(projectGet).toMatchObject<ProjectModel>(project);
  });

  test("update project test", async () => {
    const newData: Partial<ProjectModel> = {
      name: faker.commerce.productName(),
      deadline: faker.date.future(),
    };

    Project.updateOne = jest.fn();

    await service.updateProject(id, newData);

    expect(Project.updateOne).toHaveBeenLastCalledWith(
      { _id: id },
      { ...newData }
    );
  });

  test("delete project test", async () => {
    Project.deleteOne = jest.fn();
    jest.spyOn(User, "updateOne");

    agenda.now = jest.fn();

    await service.deleteProject(id, id);

    expect(Project.deleteOne).toHaveBeenCalledWith({ _id: id });
    expect(User.updateOne).toHaveBeenCalled();
    expect(agenda.now).toHaveBeenLastCalledWith("delete project tasks", {
      projectId: id,
    });
  });
});
