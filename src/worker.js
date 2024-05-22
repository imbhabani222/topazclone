import envConfig from "./env-url";
const REACT_APP_ENV = process.env.REACT_APP_ENV || "development";
export const APIs = envConfig[REACT_APP_ENV].API;
