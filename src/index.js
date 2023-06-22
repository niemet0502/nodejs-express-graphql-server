import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

let students = [
  { id: "1", firstName: "John", lastName: "Doe", age: 20 },
  { id: "2", firstName: "Jane", lastName: "Smith", age: 22 },
];

const schema = buildSchema(`
  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int!
  }

  type Query {
    student(id: ID!): Student
    students: [Student]
  }

  type Mutation {
    createStudent(firstName: String!, lastName: String!, age: Int!): Student
    updateStudent(id: ID!, firstName: String, lastName: String, age: Int): Student
    deleteStudent(id: ID!): Boolean
  }
`);

const root = {
  student: ({ id }) => students.find((student) => student.id === id),
  students: () => students,
  createStudent: ({ firstName, lastName, age }) => {
    const newStudent = {
      id: String(students.length + 1),
      firstName,
      lastName,
      age,
    };
    students.push(newStudent);
    return newStudent;
  },
  updateStudent: ({ id, firstName, lastName, age }) => {
    const studentIndex = students.findIndex((student) => student.id === id);
    if (studentIndex !== -1) {
      if (firstName) students[studentIndex].firstName = firstName;
      if (lastName) students[studentIndex].lastName = lastName;
      if (age) students[studentIndex].age = age;
      return students[studentIndex];
    }
    return null;
  },
  deleteStudent: ({ id }) => {
    const initialLength = students.length;
    students = students.filter((student) => student.id !== id);
    return students.length !== initialLength;
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("GraphQL server running at http://localhost:4000/graphql");
});
