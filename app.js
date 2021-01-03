const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _=require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');






mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});
const todoSchema=new mongoose.Schema({name:String});
const Item=mongoose.model("Item",todoSchema);
const item1=new Item({name:"Start your list here"});
const item2=new Item({name:"Push + button to submit"});
const item3=new Item({name:"<-- Check This to delete your list item"});
const defaultItems=[item1,item2,item3];
//var items=[];
//var work=[];


//for custom lists
const listSchema=new mongoose.Schema({name:String,items:[todoSchema]});
const List=mongoose.model("List",listSchema);




app.get("/",function(req,res){
  const today=date();
  Item.find({},function(err,foundItems){
    if(foundItems.length===0)
    {
      Item.insertMany(defaultItems,function(err)
      {if(err)
        {console.log(err)
        }
    else
    {console.log("Successfully added the default items");
    }
  });
  res.redirect("/");
    }
    else{
      res.render("index",{dayname:today,listitems:foundItems,listTitle:"TodoList",listHead:"TodoList"});
    }
  });
});





app.post("/",function(req,res){ const itemName=req.body.it;
  const listName=req.body.submit;
const item=new Item({name:itemName});
if(listName==="TodoList"){item.save();
res.redirect("/");}
else{
  console.log(listName);
  List.findOne({name:listName},function(err,foundList){if(err){console.log("err");}
else{foundList.items.push(item);
foundList.save();
res.redirect("/"+listName);}});
}

});



app.post("/delete",function(req,res){
  const checkedItemid=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="TodoList")
  {Item.findByIdAndRemove(checkedItemid,function(err){if(!err){console.log( "Successfully deleted checked");
res.redirect("/");}});}
else{List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemid}}},function(err,foundList){if(!err){res.redirect("/"+listName);}});}


});




app.get("/:customListName",function(req,res){
  const today=date();
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName},function(err,foundList)
     {if(!err)
       {if(!foundList)
         {
    const list=new List({name:customListName,items:defaultItems});
    list.save();
    res.redirect("/"+customListName);
}
else{  res.render("index",{dayname:today,listitems:foundList.items,listTitle:foundList.name,listHead:foundList.name});}}});

});


app.listen(3000,function(){console.log("Server started")});
