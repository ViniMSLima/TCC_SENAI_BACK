const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const { User } = require("../models/user");
const { postUser, deleteById } = require("../controller/userController");

// Configuração de teste
beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://vinisarylima:U2FsdGVkX19KiK2gxjgwptjL1MM7axuytBzh2cvkNUc=@tcc.wvxjo.mongodb.net/testcase",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const user = new User({
    name: "initial user",
    birthdate: "00/00/0000",
    adm: true,
    sex: "Masculino",
    BoschID: "initial user",
    password: "initialuserpassword",
    email: "initialuser@gmail.com",
    cep: "00000000",
    release: Date.now(),
    createdAt: Date.now(),
  });

  const savedUser = await user.save();
  testUserId = savedUser._id.toString(); 
  testBoschIDEncrypted = "initial user";
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("User Controller Tests", () => {
  test("should create a user successfully", async () => {
    const req = {
      body: {
        name: "aaaaa aaaaa aaaaa",
        birthdate: "00/00/0000",
        adm: true,
        sex: "Masculino",
        BoschID: "repeatedboschid",
        password: "aaaaaaaaaaaa",
        email: "repeatedemail@gmail.com",
        cep: "00000000",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await postUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "User registered successfully!",
    });
  });

  test("should return 400 if required fields are missing", async () => {
    const req = {
      body: {
        // Missing required fields
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await postUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Field's can't be empty.",
    });
  });

  test("should return 401 if user with same BoschID already exists", async () => {
    const req = {
      body: {
        name: "aaaaa aaaaa aaaaa",
        birthdate: "00/00/0000",
        adm: true,
        sex: "Masculino",
        BoschID: "repeatedboschid",
        password: "aaaaaaaaaaaa",
        email: "notrepeatedemail@gmail.com",
        cep: "00000000",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await postUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      error: "An user with this ID already exists!",
    });
  });

  test("should return 401 if user with same email already exists", async () => {
    const req = {
      body: {
        name: "aaaaa aaaaa aaaaa",
        birthdate: "00/00/0000",
        adm: true,
        sex: "Masculino",
        BoschID: "notrepeatedboschid",
        password: "aaaaaaaaaaaa",
        email: "repeatedemail@gmail.com",
        cep: "00000000",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await postUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      error: "An user with this email already exists!",
    });
  });

  test('Testing deleteById', async () => {
    const req = {
      params: {
        id: testUserId,
      }
    };

    console.log(testUserId)

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await deleteById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'User deleted successfully!' });

    const deletedUser = await User.findById(testUserId);
    expect(deletedUser).toBeNull();
  });

  test('Testing deleteById with non-existent user', async () => {
    const req = {
      params: {
        id: new mongoose.Types.ObjectId(),
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await deleteById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'User not found!' });
  });
  
});
