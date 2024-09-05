const mongoose = require('mongoose');
const { Machine } = require('../models/machine');

const { 
  getMachines,
  getMachinesBySector,
  postMachine,
  clearMachines,
  deleteMachineById,
  IncreaseRedCount,
  IncreaseBlueCount,
  IncreaseRejectedCount
} = require('../controller/machineController');

let id = '';
const req = {
  params: {
    id: id,
  },
};

// Conectar ao banco de dados antes dos testes
beforeAll(async () => {
  await mongoose.connect('mongodb+srv://vinisarylima:U2FsdGVkX19KiK2gxjgwptjL1MM7axuytBzh2cvkNUc=@tcc.wvxjo.mongodb.net/testcase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  
  // Criar uma máquina para usar nos testes
  const machine = new Machine({
    AIAccuracy: 95,
    Process: 'Test Process',
    Sector: 'Test Sector',
    Blue: 0,
    Red: 0,
    Rejected: 0,
    Scanned: 0,
    release: Date.now(),
    createdAt: Date.now(),
  });

  const savedMachine = await machine.save();
  id = savedMachine._id.toString(); // Armazenar o ID da máquina criada
});

// Fechar a conexão do banco de dados após todos os testes
afterAll(async () => {
  await Machine.deleteMany({});
  await mongoose.connection.close();
});

// Função para criar uma máquina de teste
async function createTestMachine() {
  const machine = new Machine({
    AIAccuracy: 98,
    Process: '1111',
    Sector: 'ct-101',
    Blue: 0,
    Red: 0,
    Rejected: 0,
    Scanned: 0,
    release: Date.now(),
    createdAt: Date.now(),
  });
  
  await machine.save();
  return machine;
}

// Testes
describe('Machine Controller Tests', () => {
  let testMachineId;

  beforeAll(async () => {
    const machine = await createTestMachine();
    testMachineId = machine._id.toString();
  });

  test('should get all machines', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getMachines(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });

  test('should get machines by sector', async () => {
    const req = { params: { sector: 'Sector1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getMachinesBySector(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });

  test('should post a machine', async () => {
    const req = {
      body: {
        AIAccuracy: 98,
        Process: '1111',
        Sector: 'ct-101'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await postMachine(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: 'Machine registered successfully' });
  });

  test('should delete a machine by ID', async () => {
    const req = { params: { id: testMachineId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await deleteMachineById(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'Machine deleted successfully' });
  });

  test('should increase red count', async () => {
    const req = { params: { id: id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await IncreaseRedCount(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: 'Red + 1 | Scanned + 1' });
  });

  test('should increase blue count', async () => {
    const req = { params: { id: id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await IncreaseBlueCount(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: 'Blue + 1 | Scanned + 1' });
  });

  test('should increase rejected count', async () => {
    const req = { params: { id: id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await IncreaseRejectedCount(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: 'Rejected + 1 | Scanned + 1' });
  });

  test('should clear all machines', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await clearMachines(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'All Machines deleted successfully' });
  });

});
