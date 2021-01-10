const { request } = require('express');
const express = require('express');
const app = express();
const Joi = require('joi');
app.use(express.json());

const courses = [
    {id: 1, name:'Java'}, 
    {id: 2, name:'NodeJS'},
    {id: 3, name:'Python'},
]

app.get('/',(req, res) => {
  if (req.url === '/'){
     res.send('Hello World');
  } else {
      res.send('Wrong URL');
  }
});

app.get('/api/courses',(req, res) => {
    if (req.url === '/api/courses'){
       res.send(courses);
    } else {
        res.send('Wrong URL');
    }
  });

  app.get('/api/courses/:id',(req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course) return res.status(404).send('Course not found');
   res.send(course);
  });

app.post('/api/courses',(req, res) => {

    const { error } = validateSchema(req.body);
    if (error){
        return res.status(400).send(error);
        
    }
  const course = {
      id: courses.length + 1,
      name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id',(req, res) =>{

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('Course not found');
    const {error} = validateSchema(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    course.name =  req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id',(req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('Course not found');
    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(courses);
    
});

function validateSchema(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return Joi.validate(course, schema);
}

var port = process.env.PORT || 3000
app.listen(port,() => console.log('Listening on port', port));