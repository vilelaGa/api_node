const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const salt = 10;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "banco_node",
});

app.use(express.json());
app.use(cors());

/**
 * Função registrar usuario
 */
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }

    if (result.length == 0) {
      bcrypt.hash(password, salt, (err, hash) => {
        db.query(
          "INSERT INTO usuarios (email, senha) VALUES(?, ?)",
          [email, hash],
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send({ msg: "Cadastrado com sucesso" });
          }
        );
      });
    } else {
      res.send({ msg: "Email invalido" });
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result.length == 1) {
        bcrypt.compare(password, result[0].password, (err, result) => {
          if (err) {
            res.send({ msg: "Senha invalida" });
          } else if (result == true) {
            console.log(result[2].id);
            res.send({ msg: "Logado" });
          }
        });
      } else {
        res.send({ msg: "Usuario invalido" });
      }
    }
  });
});

const port = 12345;

app.listen(port, () => {
  try {
    console.log(`Servidor rodando na porta ${port}`);
  } catch (error) {
    console.log(`Servidor deu pau ${error.Message}`);
  }
});
