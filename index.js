const express = require('express');
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('public'));
mongoose.connect("mongodb://127.0.0.1/wikiDB");
const articleSchema = {
    title:String,
    content:String
}
const Article = mongoose.model("article",articleSchema);

    
app.route('/articles').get(function(req,res){
        Article.find({},function(err,callback){
                if(err) throw err;
                res.send(callback);
        })
    }).delete(function(req,res){
        Article.deleteMany({},function(err){
            if(err){console.log(err)}
            res.send("succes, we deleted everything");
        })
    }).get(function(req,res){
        Article.find({},function(err,callback){
                if(err) throw err;
                res.send(callback);
        })
    }).post(function(req,res){
        console.log(req.body);
        const newArticle = new Article({
            title:req.body.title,
            content:req.body.content
        })
        newArticle.save(function(err){
            if(!err){
                res.send("zapisano rekord w bazie danych");
            }
        });
    })
app.route('/articles/:title').get(function(req,res){
    Article.find({title:req.params.title},function(err,callback){
            if(err) throw err;
            res.send(callback);
    })
}).delete(function(req,res){
    Article.deleteMany({title:req.params.title},function(err){
        if(err){console.log(err)}
        res.send("succes, we deleted everything");
        })
    }).put(function(req,res){
        Article.update(
            {title: req.params.title},
            {title:req.body.title, content:req.body.content},
            {overwrite: true}
        )
    }).patch(function(req,res){
        Article.update({title: req.params.title},
                        {$set: req.body},
            function(err){
                if(!err){
                    res.send("Success");
                }
            }
        )
    });

app.listen(port,function(){
    console.log(`server is listening on port ${port}`);
})