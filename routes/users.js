const express = require('express');
const bcrypt = require('bcrypt');
const { addUser, getUserByEmail, updateUserPictureUrl, updateUser, getUserById, getUsers, deleteUser } = require('../data/users');
const jwt = require('jsonwebtoken');
const { auth } = require('../middlewares/auth');
const { validateUserSchema } = require('../middlewares/validations');
const router = express.Router();

// signup user
router.post('/', validateUserSchema, async (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) next(err);
    else {
      try {
        await addUser(email, hash, firstName, lastName, phoneNumber);
        res.send({ user: { email } });
      }
      catch(err) {
        console.log(err);
        res.status(400).send(err);
      }
    }
  })  
});


router.get('/:id', async (req, res) => {
  try{
    const result = await getUserById(req.params.id);
    res.send(result);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.put('/:userId', async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, bio } = req.body;
    await updateUser( req.params.userId, firstName, lastName, phoneNumber, bio );
    res.send({ user: { userId: req.params.userId } });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})


// login user
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(404).send('User not found with this email');
    return;
  }
  bcrypt.compare(password, user.password_hash, (err, result) => {
    if (err) next(err);
    else {
      if (result) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.send({ 
          token,
          user: {
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber : user.phoneNumber,
            bio : user.bio,
            role : user.role
          }
        });
      } else {
        res.status(401).send('Incorrect password');
      }
    }
  });
});


router.get('/', auth, async (req, res) => {
 try{
    const user = await getUserById(req.user.id);
    if (user.role !== 'admin') {
      res.status(403).send({ message: 'Only admin can get all Userss' });
      return;
    }
    const results = await getUsers();
    res.send(results);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.delete('/:userId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userDelete = await getUserById(req.params.userId);
    const user = await getUserById(userId);
    const canDeleteUser = userDelete.userId === userId || user.role === 'admin';
    if (!canDeleteUser) {
      res.status(403).send({ message: 'Only pet creator can delete' });
      return;
    }
    await deleteUser(req.params.userId);
    res.send({ message: 'deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  
});


module.exports = router;