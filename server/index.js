const fs = require("fs");
const express = require("express");
const { ApolloServer, UserInputError } = require("apollo-server-express");
const GraphQLDate = require("./graphQL/graphQLDateScalarType");

// Setup data for manipulation

const items = [
  {
    id: 1,
    status: "New",
    owner: "PersonX2",
    createdAt: new Date("2020-06-06"),
    updatedAt: undefined,
    title: "Test item 1",
  },
  {
    id: 2,
    status: "Closed",
    owner: "PersonX1",
    createdAt: new Date("2020-06-06"),
    updatedAt: new Date("2020-06-07"),
    title: "Test item 2",
  },
];

function itemList() {
  return items;
}

function itemAdd(_, { item }) {
  const errors = [];
  if (item.title.length < 5) {
    errors.push('Field "title" is to short.');
  }
  if (errors.length > 0) {
    throw new UserInputError("Invalid input: ", { errors });
  }
  item.created = new Date();
  item.id = items.length + 1;
  items.push(item);
  return item;
}

// Setup the server

const resolvers = {
  Query: {
    itemList,
  },
  Mutation: {
    itemAdd,
  },
  GraphQLDate,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/graphQL/schema.graphql", "utf-8"),
  resolvers,
});

const app = express();

app.use(express.static("public"));
server.applyMiddleware({ app, path: "/graphql" });

const port = process.env.port || 3000;

app.listen(port, function () {
  console.log("App started on port 3000");
});
