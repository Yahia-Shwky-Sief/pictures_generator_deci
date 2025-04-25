import request from "supertest";
import "jasmine";
import { app } from "../src/server";

describe("API Endpoints", () => {
  it("should return 200 for the root endpoint", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should return 404 for an unknown endpoint", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });
});

describe("Image API Endpoints", () => {
  it("should upload an image successfully at /uploadCustomImage", async () => {
    const response = await request(app)
      .post("/api/uploadCustomImage?width=200&height=200")
      .attach("file", "images/logo.jpg");
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      jasmine.objectContaining({ message: "Image uploaded successfully." })
    );
  });

  it("should return a random image URL at /getRandomImage", async () => {
    const response = await request(app).post("/api/getRandomImage?width=200&height=200");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({ imageUrl: jasmine.any(String) })
    );
  });

  it("should serve an image at /getImage", async () => {
    const response = await request(app).get(
      "/api/getImage?width=200&height=200&filename=santamonica.jpg"
    );
    expect(response.status).toBe(201);
  });

  it("should return 404 for a non-existent image at /getImage", async () => {
    const response = await request(app).get(
      "/api/getImage?filename=nonexistent.jpg&width=200&height=200"
    );
    expect(response.status).toBe(404);
  });
});
