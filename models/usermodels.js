import databaseConnection from "../configs/dbconfigs.js";
export async function createUserModel(user) {
  let userCollection = await databaseConnection();

  try {
    // find id count
    let idCounter = await get_countDocuments();
    await userCollection.insertOne({
      id: idCounter,
      ...user,
    });

    return await userCollection.findOne({ email: user.email });
  } catch (er) {
    console.log(process.cwd() + " user insertion " + er.message);
    //   to print file that error accured
  }
}

export async function findSignupModel(user) {
  try {
    let userCollection = await databaseConnection();
    let userExist = await userCollection.findOne({
      email: user.email,
    });

    return userExist;
  } catch (er) {
    console.log(process.cwd() + " user insertion " + er.message);
  }
}

export async function get_countDocuments() {
  try {
    let userCollection = await databaseConnection();
    let idIncrement = await userCollection.countDocuments();
    if (idIncrement < 1) {
      idIncrement = 1;
    } else {
      idIncrement += 1;
    }

    return idIncrement;
  } catch (er) {
    console.log(process.cwd() + " user insertion " + er.message);
  }
}

export async function findLoginModel(user) {
  try {
    let userCollection = await databaseConnection();
    let userExist = await userCollection.findOne({ email: user.email });

    return userExist;
  } catch (er) {
    console.log(process.cwd() + " user insertion " + er.message);
  }
}

export async function findUserById(user) {
  try {
    let userCollection = await databaseConnection();
    let userExist = await userCollection.findOne({ _id: ObjectId(user?._id) });

    return userExist;
  } catch (er) {
    console.log(process.cwd() + " user insertion " + er.message);
  }
}
