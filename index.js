const express = require('express');
var cors = require('cors')
const { Client } = require('pg');


const port = 8000;
const app = express();
app.use(express.json());
app.use(cors())
const client = new Client({
    user: "yadmin",
    password: "pass",
    host: "51.250.39.117",
    port: 5432,
    database: "artStruktura",
})
client.connect();

app.get('/videos/:lim', (request, response) => {

    client.query(`SELECT public."websiteVideo".id, video_name, video_description, video_url, thumbnail_url
	FROM public."websiteVideo" ORDER BY public."websiteVideo".id DESC LIMIT $1;`, [request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "videos": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

app.get('/videos/id/:id', (request, response) => {

    client.query(`SELECT public."websiteVideo".id, video_name, video_description, video_url, thumbnail_url
	FROM public."websiteVideo" WHERE public."websiteVideo".id = $1;`, [request.params.id], (err, res) => {
        if (!err) {
            response.json(res.rows[0])
        } else {
            response.json(err.message)
        }
    })

})

app.get('/websitePosts/:lim', (request, response) => {

    client.query(`SELECT public."websitePosts".id, post_name, "post_imageUrl", post_header, post_text, post_date
	FROM public."websitePosts" ORDER BY public."websitePosts".id DESC LIMIT $1;`, [request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "posts": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

app.get('/websitePosts/id/:id', (request, response) => {

    client.query(`SELECT public."websitePosts".id, post_name, "post_imageUrl", post_header, post_text, post_date
	FROM public."websitePosts" WHERE public."websitePosts".id = $1;`, [request.params.id], (err, res) => {
        if (!err) {
            response.json(res.rows[0])
        } else {
            response.json(err.message)
        }
    })

})

//---------------------------------- TRAININGS


app.get('/trainingsAll/:lim', (request, response) => {

    client.query(`SELECT public.trainings.id, training_name, image_url, video_url, categorie_id, training_comment, training_name_en, training_comment_en
	FROM public.trainings ORDER BY public.trainings.id DESC LIMIT $1`, [request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "trainings": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})




app.get('/trainingsByWord/:word/:lim', (request, response) => {

    client.query(`SELECT public.trainings.id, training_name, image_url, video_url, categorie_id, training_comment, training_name_en, training_comment_en
	FROM public.trainings
	WHERE UPPER("training_name")  LIKE '%' || UPPER($1) || '%'
    OR
	UPPER("training_name_en")  LIKE '%' || UPPER($1) || '%'
    ORDER BY id DESC LIMIT $2`, [request.params.word, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "trainings": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})


app.get('/trainingsByCategorie/:cat/:lim', (request, response) => {
    client.query(`SELECT public.trainings.id, training_name, image_url, video_url, categorie_id, training_comment, training_name_en, training_comment_en
	FROM public.trainings
	INNER JOIN public.categories
	ON public.categories.id = public.trainings.categorie_id
	WHERE public.categories.id = $1
	ORDER BY public.trainings.id DESC
	LIMIT $2;`, [request.params.cat, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "trainings": res.rows
            })
        } else {
            response.json(err.message)
        }
    })
})

app.get('/trainingsByCategorieWordFilter/:cat/:word/:lim', (request, response) => {
    client.query(`SELECT public.trainings.id, training_name, image_url, video_url, categorie_id, training_comment, training_name_en, training_comment_en
	FROM public.trainings
	INNER JOIN public.categories
	ON public.categories.id = public.trainings.categorie_id
	WHERE public.categories.id = $1
	AND
	UPPER(public.trainings.training_name)  LIKE '%' || UPPER($2) || '%'
	ORDER BY public.trainings.id DESC
	LIMIT $3;`, [request.params.cat, request.params.word, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "trainings": res.rows
            })
        } else {
            response.json(err.message)
        }
    })
})


app.get('/categories', (request, response) => {

    client.query(`SELECT public.categories.id, categorie_name, categorie_name_en
	FROM public.categories;`, (err, res) => {
        if (!err) {
            response.json({
                "categories": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

app.get('/excersises/:trainid', (request, response) => {

    client.query(`SELECT ex_name, ex_train_comment, ex_rest_time, ex_start_time, ex_thumbnail_url, ex_name_en, ex_train_comment_en, ex_rest_time_en
	FROM public.exercises INNER JOIN public.trainings ON trainings.id = exercises.train_id
	WHERE public.trainings.id = $1
    ORDER BY public.exercises.id ASC;`, [request.params.trainid], (err, res) => {
        if (!err) {
            response.json({
                "excersises": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})


//-------------------------------------------- HEALTH


app.get('/healthAll/:lim', (request, response) => {

    client.query(`SELECT 
	public.health.id, 
	health_name, image_url, video_url, 
	"hCategorie_id", health_comment, 
	health_name_en, health_comment_en
	FROM public.health ORDER BY public.health.id DESC 
	LIMIT $1;`, [request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "healthList": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})



app.get('/healthByWord/:word/:lim', (request, response) => {

    client.query(`SELECT 
	public.health.id, 
	health_name, image_url, video_url, 
	"hCategorie_id", health_comment, 
	health_name_en, health_comment_en
	FROM public.health 
	WHERE UPPER("health_name")  LIKE '%' || UPPER($1) || '%' 
    OR
	UPPER("health_name_en")  LIKE '%' || UPPER($1) || '%'
	ORDER BY id DESC LIMIT $2`, [request.params.word, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "healthList": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

app.get('/healthByCategorie/:cat/:lim', (request, response) => {
    client.query(`SELECT 
	public.health.id, 
	health_name, image_url, video_url, 
	"hCategorie_id", health_comment, 
	health_name_en, health_comment_en
	FROM public.health
	INNER JOIN public."healthCategories" ON "healthCategories".id = health."hCategorie_id"
	WHERE public."healthCategories".id = $1 
	ORDER BY public.health.id DESC LIMIT $2;`, [request.params.cat, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "healthList": res.rows
            })
        } else {
            response.json(err.message)
        }
    })
})

app.get('/healthByCategorieWordFilter/:cat/:word/:lim', (request, response) => {
    client.query(`SELECT 
	public.health.id, 
	health_name, image_url, video_url, 
	"hCategorie_id", health_comment, 
	health_name_en, health_comment_en
	FROM public.health
	INNER JOIN public."healthCategories" ON "healthCategories".id = health."hCategorie_id"
	WHERE public."healthCategories".id = $1
	AND
	UPPER(public.health.health_name)  LIKE '%' || UPPER($2) || '%'
	ORDER BY public.health.id DESC LIMIT $3;`, [request.params.cat, request.params.word, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "healthList": res.rows
            })
        } else {
            response.json(err.message)
        }
    })
})

app.get('/healthCategories', (request, response) => {

    client.query(`SELECT public."healthCategories".id, categorie_name, categorie_name_en
	FROM public."healthCategories";`, (err, res) => {
        if (!err) {
            response.json({
                "healthCategories": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

app.get('/healthExcersises/:trainid', (request, response) => {

    client.query(`SELECT h_ex_name, h_ex_comment, h_ex_rest_time,
    h_ex_start_time, h_ex_thumbnail_url, h_ex_name_en,
    h_ex_comment_en, h_ex_rest_time_en
    FROM public."healthExercises" 
    INNER JOIN public.health ON health.id = "healthExercises".health_id
    WHERE public.health.id = $1
    ORDER BY public."healthExercises".id ASC
    ;`, [request.params.trainid], (err, res) => {
        if (!err) {
            response.json({
                "healthExcersises": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

app.get('/musicByCategorie/:cat/:lim', (request, response) => {
    client.query(`SELECT 
	public.music.id, 
	track_name, track_author, categorie_id, 
	audio_url, image_url
	FROM public.music INNER JOIN public."musicCategories" ON public."musicCategories".id = music.categorie_id
	WHERE public."musicCategories".id = $1
	ORDER BY public.music.id DESC LIMIT $2;`, [request.params.cat, request.params.lim], (err, res) => {
        if (!err) {
            response.json({
                "tracksList": res.rows
            })
        } else {
            response.json(err.message)
        }
    })
})

app.get('/musicCategories', (request, response) => {

    client.query(`SELECT public."musicCategories".id, categorie_name, categorie_name_en
	FROM public."musicCategories";`, (err, res) => {
        if (!err) {
            response.json({
                "musicCategories": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})

//------------------------constructor--------------------------------




app.post('/constructor', async(request, response) => {
    let bufferData = []
    let responseData = []
    let tags = request.body.tags

    for (let index = 0; index < tags.length; index++) {
        let query = await client.query(`SELECT * FROM public."constructor_${tags[index]}" ORDER BY RANDOM() limit 5;`)

        bufferData.push(query.rows)
    }

    bufferData.forEach(element => {
        element.forEach(exObject => {
            delete exObject.ex_id
            responseData.push(exObject)
        });
    });


    response.json({ "generatedTraining": responseData })
})


app.get('/constructorCategories', (request, response) => {

    client.query(`SELECT *
	FROM public."constructor_all";`, (err, res) => {
        if (!err) {
            response.json({
                "constructorCategories": res.rows
            })
        } else {
            response.json(err.message)
        }
    })

})



//--------------------------------------------------------------------


app.get('/', (req, res) => {
    res.json("попробуйте другой роут, здесь данных нет")
})

app.listen(
    port,
    () => { console.log("server started on port " + port) }
);