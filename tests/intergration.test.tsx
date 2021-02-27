import "fake-indexeddb/auto";
import "jest-localstorage-mock";
import React from "react";
import Twitter from "twitter";
import { mocked } from "ts-jest/utils";
import { App as FrontApp } from "frontend/app";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { makeServer, makeSetUpTwitterMock } from "./utilForTest";

jest.mock("twitter");
const TwitterMocked = mocked(Twitter, true);

const setUpTwitterMock = makeSetUpTwitterMock(TwitterMocked);

describe("intergration", () => {
  const { server } = makeServer({ port: 3000 });
  let renderResult: ReturnType<typeof render>;
  beforeAll(async () => {
    await server.run();
  });
  beforeEach(async () => {
    renderResult = render(<FrontApp />);
    await waitFor(() => {
      screen.getByRole("main");
    });
  });
  afterAll(async () => {
    await server.close();
  });
  describe("Normal", () => {
    it("changeTab", async () => {
      expect(screen.getByLabelText("timeline")).toBeInTheDocument();
      const configTab = screen.getByLabelText("configTab");
      fireEvent.click(configTab);
      expect(
        await screen.findByRole("article", { name: /config/ }),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("timeline")).toBe(null);

      const dataTab = screen.getByLabelText("dataTab");
      fireEvent.click(dataTab);
      expect(
        await screen.findByRole("article", { name: /data/ }),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("config")).toBe(null);

      const timelineTab = screen.getByLabelText("timelineTab");
      fireEvent.click(timelineTab);
      expect(
        await screen.findByRole("article", { name: /timeline/ }),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("data")).toBe(null);
    });
    it("change color mode", async () => {
      const body = renderResult.container.parentElement as HTMLBodyElement;
      const beforeStyle = window.getComputedStyle(body);
      fireEvent.click(screen.getByLabelText("configTab"));
      fireEvent.click(await screen.findByLabelText("toggleThemeButton"));
      await waitFor(() => {
        const afterStyle = window.getComputedStyle(body);
        expect(beforeStyle.backgroundColor).not.toEqual(
          afterStyle.backgroundColor,
        );
      });
    });
  });
  describe("Exception", () => {});
});
