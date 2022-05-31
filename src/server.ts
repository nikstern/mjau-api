import app from "./app";

const server = app.listen(app.get("port"), "0.0.0.0", () => {
  console.log(
    "App is running on 0.0.0.0:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});

export default server;
