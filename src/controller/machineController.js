const { Machine } = require("../models/machine");

require("dotenv").config();

class MachineController {
    static async getMachines(req, res) {
        try {
            const machine = await Machine.find();
            return res.status(200).send({ machine });
        } catch (error) {
            return res.status(404).send({ error: 'Machines not found!' });
        }
    }

    static async getMachinesBySector(req, res) {
        const sector = req.params.sector;
        try {
            const machines = await Machine.find({ Sector: sector });
            return res.status(200).send({ machines });
        } catch (error) {
            return res.status(404).send({ error: 'Machines not found!' });
        }
    }
    
    static async postMachine(req, res) {
        const { AIAccuracy, Process, Sector} = req.body;

        if (!AIAccuracy || !Sector)
            return res.status(400).send({ message: 'Field\'s can\'t be empty' });

        const machine = new Machine({
            AIAccuracy,
            Process: toString(Process),
            Approved: 0,
            Denied: 0,
            Sector,
            Scanned: 0,
            release: Date.now(),
            createdAt: Date.now(),
        });

        try {
            await machine.save();
            res.status(201).send({ message: 'Machine registered successfully' });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Something failed while creating a Machine' });
        }
    }

    static async clearMachines(req, res) {
        try {
            await Machine.deleteMany({});
            return res.status(200).send({ message: 'All Machines deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while deleting Machines' });
        }
    }

    static async deleteMachineById(req, res) {
        const { id } = req.params;
        
        try {
            const deletedMachine = await Machine.findByIdAndDelete(id);
    
            if (!deletedMachine) {
                return res.status(404).send({ message: 'Machine not found' });
            }
    
            return res.status(200).send({ message: 'Machine deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while deleting the Machine' });
        }
    }
}

module.exports = MachineController;
