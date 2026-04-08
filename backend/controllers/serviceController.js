const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        const { name, description, icon, category, price, duration, department, availableDays } = req.body;
        if (!name || !description) return res.status(400).json({ success: false, message: 'Name and description are required' });

        const serviceData = { name, description, icon, category, price, duration, department, availableDays };
        if (req.file) {
            serviceData.image = req.file.filename;
        }

        const service = await Service.create(serviceData);
        res.status(201).json({ success: true, message: 'Service created successfully', data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = req.file.filename;
        }

        const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, message: 'Service updated successfully', data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
