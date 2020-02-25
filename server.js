express = require('express');
cors = require('cors');
bodyParser = require('body-parser');
mongoose = require('mongoose');

const router = express.Router();


const Issue = require('./models/Issue');

const app = express();
app.get('/',(req,res)=> res.send('hello world!'));
app.listen(4000,()=> console.log('express server running on port 4000'));

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issue1');

const connection = mongoose.connection;


connection.once('open',()=>{
    console.log('MongoDB database connection establish succesfully!');
});

router.route('/issues').get((req,res)=>{
    Issue.find((err,issues)=>{
        if(err)
        console.log(err);
        else
        res.json(issues);
    });
});

router.route('/issues/:id').get((req,res)=>{
    Issue.findById(req.params.id, (err,issue)=>{
        if(err)
        console.log(err);
        else
        res.json(issue);
});
});

router.route('/issues/add').post((req,res)=>{
    let issue = new Issue(req.body);
    issue.save()
        .then(issue=> {
            res.status(200).json({'issue':'Added succesfully'});
        })
        .catch(err=>{
            res.status(400).send('Failed to create new record');
        });
});

//router.route('/issues/update/:id').post((req,res)=>{
  //  let issue = new Issue(req.body);
    //issue.save()
    //.then(issue=>{
      //  res.status(200).json({'issue':'updated successfully'});
    //})
    //.catch(err=>{
      //  res.status(400).send('failed to create new record');
    //});
//});

router.route('/issues/update/:id').post((req,res)=>{
    Issue.findById(req.params.id,(err,issue)=>{
        if(!issue)
            return next(new Error('Could not load document'));
        else
           issue.title = req.body.title;
           issue.responsible = req.body.responsible;
           issue.description = req.body.description;
           issue.severity = req.body.severity;
           issue.status = req.body.status;

           issue.save().then(issue =>{
               res.json('Updated done');
           }).catch(err =>{
               res.status(400).send('updated failed');
           });
    });
});

router.route('/issues/delete/:id').delete((req,res) => {
    Issue.findByIdAndRemove({_id: req.params.id},(err,issue) => {
        if(err)
        {
        res.json(err);
        console.log('error has occured');
        }
        else
        {
        res.json(issue);
        }
    });
});

app.use('/',router);