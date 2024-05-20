const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors'); // Ajouter cette ligne pour importer le middleware CORS

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Ajouter cette ligne pour utiliser le middleware CORS

// Configuration de la connexion à la base de données
const dbConfig = {
    server: 'localhost',
    database: 'attendance management app',
    user: 'sa',
    password: '2004',
    options: {
        encrypt: false
    }
};

// Connexion à la base de données
sql.connect(dbConfig, err => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connecté à la base de données');
    }
});

// Servir les fichiers statiques depuis le dossier 'ama admin'
app.use(express.static('C:/Users/aya/Desktop/ama admin'));

// Route pour créer un nouvel employé
app.post('/create_employee', (req, res) => {
    const { 'employee-id': employeeId, 'employee-name': name, 'employee-function': employeeFunction, 'working-hours': workingHours, 'employee-password': password } = req.body;

    // Afficher les données du formulaire dans la console
    console.log('Données du formulaire reçues :');
    console.log(`Employee ID: ${employeeId}`);
    console.log(`Name: ${name}`);
    console.log(`Function: ${employeeFunction}`);
    console.log(`Working Hours: ${workingHours}`);
    console.log(`Password: ${password}`);

    // Requête d'insertion
    const query = `INSERT INTO Employees (EmployeeID, Name, Functio, Password, WorkingHours) 
                   VALUES (@employeeId, @name, @employeeFunction, @password, @workingHours)`;

    // Exécution de la requête avec des paramètres pour éviter les injections SQL
    const request = new sql.Request();
    request.input('employeeId', sql.Int, parseInt(employeeId));
    request.input('name', sql.NVarChar, name);
    request.input('employeeFunction', sql.NVarChar, employeeFunction);
    request.input('workingHours', sql.Int, parseInt(workingHours));
    request.input('password', sql.Int, parseInt(password));

    request.query(query, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err);
            res.status(500).send('Erreur lors de l\'insertion des données');
        } else {
            console.log('Employé créé avec succès');
            res.send('Employé créé avec succès');
        }
    });
});

// Nouvelle route pour récupérer la liste des employés
app.get('/employees', (req, res) => {
    const query = 'SELECT EmployeeID, Name, Functio, WorkingHours FROM Employees';
    const request = new sql.Request();

    request.query(query, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des données :', err);
            res.status(500).send('Erreur lors de la récupération des données');
        } else {
            res.json(result.recordset);
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
