const express = require('express');
const { getPets, createPet, getPetsByUserId, getPetById, deletePet, updatePet, editPet } = require('../data/pets');
const { auth } = require('../middlewares/auth');
const { getUserById } = require('../data/users');
const { upload } = require('../middlewares/multipart');
const { uploadToCloudinary } = require('../lib/cloudinary');
const router = express.Router();
const fs = require('fs');


router.get('/', async (req, res) => {
  try{
    const results = await getPets(req.query);
    res.send(results);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


router.post('/', auth, upload.single('petPicture'), async (req, res) => {

  try {
    const user = await getUserById(req.user.id);
    if (user.role !== 'admin') {
      res.status(403).send({ message: 'Only admin can get all Pets' });
      return;
    }

    const petItem = JSON.parse(req.body.petItem);
    const result = await uploadToCloudinary(req.file.path);
    petItem.picture = result.secure_url;
    await createPet(petItem);
    fs.unlinkSync(req.file.path);
    res.send();
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

});

router.put('/', async (req, res) => {
  const { id, adoptionStatus, userId } = req.body;
  try {
    await updatePet( id, adoptionStatus, userId );
    res.send({ pet: { id, adoptionStatus, userId } });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})

router.put('/:petId', async (req, res) => {
  try {
    await editPet(req.params.petId, req.body.petItem);
    res.send({ pet: { userId: req.params.petId } });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})


// GET /pets/user
router.get('/user/:userId', async (req, res) => {
  try{
    const results = await getPetsByUserId(req.params.userId);
    res.send(results);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const pet = await getPetById(id);
  res.send({ pet });
});

router.delete('/:petId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const pet = await getPetById(req.params.petId);
    const user = await getUserById(userId);
    const canDeletePet = pet.userId === userId || user.role === 'admin';
    if (!canDeletePet) {
      res.status(403).send({ message: 'Only pet creator can delete' });
      return;
    }
    await deletePet(req.params.petId);
    res.send({ message: 'deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  
});

module.exports = router;