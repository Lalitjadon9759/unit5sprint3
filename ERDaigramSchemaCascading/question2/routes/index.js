const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');

router.post('/doctors', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post('/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/consultations', async (req, res) => {
  try {
    const { doctorId, patientId, notes } = req.body;
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !doctor.isActive) {
      return res.status(400).json({ error: "Doctor not active or not found." });
    }
    if (!patient || !patient.isActive) {
      return res.status(400).json({ error: "Patient not active or not found." });
    }

    const consultation = new Consultation({ doctorId, patientId, notes });
    await consultation.save();
    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/doctors/:id/patients', async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.params.id, isActive: true })
      .populate({ path: 'patientId', select: 'name age gender' })
      .sort({ consultedAt: -1 })
      .limit(10);

    const patients = consultations.map(c => c.patientId);
    res.json(patients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/patients/:id/doctors', async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.params.id, isActive: true })
      .populate({ path: 'doctorId', select: 'name specialization' });

    const doctors = consultations.map(c => c.doctorId);
    res.json(doctors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/doctors/:id/consultations/count', async (req, res) => {
  try {
    const count = await Consultation.countDocuments({ doctorId: req.params.id, isActive: true });
    res.json({ count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/patients', async (req, res) => {
  try {
    const { gender } = req.query;
    const patients = await Patient.find({ gender: gender, isActive: true });
    res.json(patients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/consultations/recent', async (req, res) => {
  try {
    const consultations = await Consultation.find({ isActive: true })
      .sort({ consultedAt: -1 })
      .limit(5)
      .populate('doctorId', 'name')
      .populate('patientId', 'name');
    res.json(consultations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ doctorId: req.params.id }, { isActive: false });
    res.json({ message: "Doctor and related consultations marked inactive." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ patientId: req.params.id }, { isActive: false });
    res.json({ message: "Patient and related consultations marked inactive." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
