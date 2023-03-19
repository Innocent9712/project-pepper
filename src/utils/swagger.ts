// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
import { Request, Response, Express } from "express";
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import {version} from "../../package.json"
import { PORT } from "../server";


const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Pepper Inventory API",
        version,
        description:
          "This is an Inventory API application made with Express and documented with Swagger",
    //     license: {
    //       name: "MIT",
    //       url: "https://spdx.org/licenses/MIT.html",
    //     },
    //     contact: {
    //       name: "Innocent",
    //       url: "https://portfolio.codekami.tech",
    //       email: "info@email.com",
    //     },
      },
    //   servers: [
    //     {
    //       url: `http://localhost:${PORT}`,
    //     },
    //   ],
    },
    apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);


function swaggerDocs(app: Express, port: string | number) {
    app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
    );

    app.get("docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    })
}

export default swaggerDocs;