const express = require('express')
const router = express.Router()
const { nanoid } = require("nanoid")

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required :
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: the auto-generated id of the book
 *         title:
 *           type: string
 *           description: the book title
 *         author:
 *           type: string
 *           description: the book author
 *       example:
 *         id: 12rfU3n_
 *         title: New Book
 *         author: Erik T.
 */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: The books management API
 */

/**
 * @swagger
 * /books:
 *  get:
 *    summary: Returns the list of all the books
 *    tags: [Books]
 *    responses:
 *      200:
 *        description: The list of the books
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Book'
 *
 */
router.get("/", (req, res) => {
  const books = req.app.db.get("books");
  res.send(books);
})

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get("/:id", (req, res) => {
  const book = req.app.db.get("books").find({ id: req.params.id }).value()
  if (!book) {
    res.sendStatus(404)
  }
  res.send(book)
})
/**
 * @swagger
 * /books:
 *  post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: The book creation error
 *
 */

router.post("/", (req, res) => {
  try {
    const book = {
      id: nanoid(idLength),
      ...req.body
    }
    req.app.db.get("books").push(book).write()
    res.send(book)
  }
  catch (e) {
    return res.status(500).send(error)
  }
})

/**
 * @swagger
 * /books/{id}:
 *  put:
 *     summary: Update the book by the id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *       500:
 *         description: The book creation error
 *
 */

router.put("/:id", (req, res) => {
  try {
    req.app.db.get("books").find({ id: req.params.id }).assign(req.body).write()
    res.send(req.app.db.get("books").find({ id: req.params.id }))
  } catch (error) {
    return res.status(500).send(error)
  }
})
/**
 * @swagger
 * /books/{id}:
 *  delete:
 *     summary: Update the book by the id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the book id
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *       404:
 *         description: The book was not found
 *       500:
 *         description: The book creation error
 *
 */

router.delete("/:id", (req, res) => {
  try {
    req.app.db.get("books").remove({ id: req.params.id }).write()
    res.sendStatus(200)
  } catch (error) {
    return res.status(500).send(error)
  }
})

module.exports = router;
