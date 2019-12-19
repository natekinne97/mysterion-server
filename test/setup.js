process.env.TZ = "UCT";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
require("dotenv").config();

process.env.TEST_DB_URL =
  process.env.TEST_DB_URL || "mongodb://localhost:27017/mysterion-test";

const { expect } = require("chai");
const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;
