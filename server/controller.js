require('dotenv').config();
// const { CONNECTION_STRING } = process.env; 
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {

    seed:(req, res) => {
        sequelize.query(`
        drop table if exists recipes;
        
        create table recipes(
            recipe_id serial primary key,
            meal_id integer,
            recipe_title varchar,
            recipe_img text,
            recipe_area varchar,
            recipe_instructions text,
            recipe_source varchar);
        `)
        .then(() =>{
            console.log('DB seeded')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding Db', err))
    },

    getRecipe: (req, res) => {
        sequelize.query(`SELECT * FROM recipes`)
        .then(dbRes => {res.status(200).send(dbRes[0])})
        .catch(e =>console.log(e));
    },

    postRecipe: (req, res) => {
        let { idMeal, strMeal, strMealThumb, strArea, strInstructions, strSource } = req.body;
        
        sequelize.query(`SELECT EXISTS (SELECT 1 FROM recipes WHERE meal_id=${idMeal});`)
        .then(dbRes => {
            if(dbRes[1].rows[0].exists === false){
                console.log(`${idMeal} does not exist, inserting into db`)
                sequelize.query(`
                insert into recipes (meal_id, recipe_title, recipe_img, recipe_area, recipe_instructions, recipe_source)
                values ('${idMeal}', '${strMeal}','${strMealThumb}','${strArea}','${strInstructions}','${strSource}');
                `)
                .then(dbRes => {res.status(200).send(dbRes[0])})
                .catch(e =>console.log(e));
            }else{
                console.log(`${idMeal} already exist`)
                res.status(409).send(`${idMeal} already exist`)
            }
        })
    },

    deleteRecipe: (req, res) => {
        console.log(req.params)
        sequelize.query(`
            DELETE FROM recipes
            WHERE meal_id = ${req.params.meal_id};
            `)
            .then(dbRes => {res.status(200).send(dbRes[0])})
            .catch(e =>console.log(e));
    },

}