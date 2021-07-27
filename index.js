var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType, NoUnusedFragmentsRule } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  id: Int
  name: String
  description: String
}
input dishInput {
  name: String
  price: Int
} 

type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!, description: String!, dishes:[dishInput]): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    const rest = restaurants.find(ele => ele.id == arg.id);
    return rest;
  },
  restaurants: () => {
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    restaurants.push({...input,});
    return restaurants[restaurants.length - 1];
  },
  deleterestaurant: ({ id }) => {
    const index = restaurants.findIndex(ele => ele.id == id);
    if(index == -1) return {ok : false};
    restaurants.splice(index, 1);
    return {ok : true};
  },
  editrestaurant: ({ id, ...restaurant }) => {
    const  index = restaurants.findIndex(ele => ele.id == id);
    if(index == -1) return;
    restaurants[index] = {id : id, ...restaurant};
    return restaurants[index];
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// export default root;
