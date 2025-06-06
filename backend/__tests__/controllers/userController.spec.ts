import { faker } from "@faker-js/faker";
import request, { Response } from "supertest";
import app from "../../src/index";
import * as service from "../../src/services/userService";
import { users } from "../../src/types/prisma";
import { ENV_VARS } from "../../src/configs/envs";

describe("User controller suite", () => {
  const user: Partial<users> = {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };

  test("get user by id request", async () => {
    jest.spyOn(service, "getUserById").mockResolvedValue(user);

    const res: Response = await request(app)
      .get("/user")
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(res.statusCode).toEqual(200);
    expect(service.getUserById).toHaveBeenCalled();
    expect(res.body.status).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  test("change user password request", async () => {
    const oldPassMock: string = "12345678";
    const newPassMock: string = "41241ERhe!&%";

    jest.spyOn(service, "changeUserPassword").mockResolvedValue(true);

    const res: Response = await request(app)
      .put("/user/changepassword")
      .send({
        oldPassword: oldPassMock,
        newPassword: newPassMock,
        confirmPassword: newPassMock,
      })
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(service.changeUserPassword).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBeDefined();
  });

  test("reset user password request", async () => {
    const tokenMock: string = "token-mock";
    const newPasswordMock: string = "41241ERhe!&%";

    jest.spyOn(service, "resetUserPassword").mockResolvedValue(true);

    const res: Response = await request(app)
      .put(`/user/resetpassword/${tokenMock}`)
      .send({ newPassword: newPasswordMock, confirmPassword: newPasswordMock });

    expect(service.resetUserPassword).toHaveBeenCalledWith(
      tokenMock,
      newPasswordMock
    );
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBeDefined();
  });

  test("delete user by id request", async () => {
    jest.spyOn(service, "deleteUserById").mockResolvedValue(true);

    const res: Response = await request(app)
      .delete("/user/deleteaccount")
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(service.deleteUserById).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
