const faker = require('faker');

const db = require('../config/connection');
const { PromptCard, User } = require('../models');

db.once('open', async () => {
  await PromptCard.deleteMany({});
  await User.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    userData.push({ username, email, password });
  }

  const createdUsers = await User.collection.insertMany(userData);

  // create followers
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];

    let followerId = userId;

    while (followerId === userId) {
      const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
      followerId = createdUsers.ops[randomUserIndex];
    }

    await User.updateOne({ _id: userId }, { $addToSet: { followers: followerId } });
  }

  // // create books
  // let createdThoughts = [];
  // for (let i = 0; i < 100; i += 1) {
  //   const thoughtText = faker.lorem.words(Math.round(Math.random() * 20) + 1);

  //   const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
  //   const { username, _id: userId } = createdUsers.ops[randomUserIndex];

  //   const createdThought = await Thought.create({ thoughtText, username });

  //   const updatedUser = await User.updateOne(
  //     { _id: userId },
  //     { $push: { thoughts: createdThought._id } }
  //   );

  //   createdThoughts.push(createdThought);
  // }

  // // create reactions
  // for (let i = 0; i < 100; i += 1) {
  //   const reactionBody = faker.lorem.words(Math.round(Math.random() * 20) + 1);

  //   const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
  //   const { username } = createdUsers.ops[randomUserIndex];

  //   const randomThoughtIndex = Math.floor(Math.random() * createdThoughts.length);
  //   const { _id: thoughtId } = createdThoughts[randomThoughtIndex];

  //   await Thought.updateOne(
  //     { _id: thoughtId },
  //     { $push: { reactions: { reactionBody, username } } },
  //     { runValidators: true }
  //   );
  // }

  console.log('all done!');
  process.exit(0);
});
