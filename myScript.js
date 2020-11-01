var input="[search engines,icon,blue]\n(google,google.com,google.com/?=TEST,icon)\n{gmail,/gmail/,/gmail/?=TEST,icon}";

var lastCategory="others";
var lastSite="";

var category=[];
var site=[];
var subsite=[];

var contents="";

var searchEngine=[
  {name:'google',adress:'google.com',search:'google.com/search?q='},
  {name:'duckduckgo',adress:'duckduckgo.com',search:"duckduckgo.com/?q=search",lucky:"duckduckgo.com/?q=%5C"}
];


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('file-input').addEventListener('change', readSingleFile, false);
  
  //getCategory("Google");
  //alert( category.find(element => element.name == "Google").name );
  //alert(category[0].name);
  
  contents=localStorage.getItem("contents");
  handleFile(contents);
  displayContents(contents);

  document.getElementById("searchQuerry").focus();
  createTable();
}, false);

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    localStorage.setItem("contents",contents);
    alert(localStorage.getItem("contents"));

  };
  reader.readAsText(file);
}

function displayContents(file) {
  //alert(contents);
  var text=contents.split('\n');
  var temp="";

  temp+="Categories:<br>"
  for(var i=0;i<category.length;i++){
    temp+=category[i].name+" "+category[i].icon+" "+category[i].color+"<br>";
  }
  temp+="<br>";
  temp+="Sites:<br>"
  for(var i=0;i<site.length;i++){
    temp+=site[i].category+" "+site[i].name+" "+site[i].adress+" "+site[i].search+" "+site[i].icon+"<br>";
  }
  temp+="<br>";
  temp+="Subsites:<br>"
  for(var i=0;i<subsite.length;i++){
    temp+=subsite[i].site+" "+subsite[i].name+" "+subsite[i].adress+" "+subsite[i].search+" "+subsite[i].icon+"<br>";
  }

  for(var i=0;i<text.length;i++){
    //temp+=text[i]+"<br>";
  }

  document.getElementById('file-content').innerHTML=temp;
}

function handleFile(file){
  var temp=file.split("\n");

  temp.forEach(function(element){
    //alert(file);
    handleLine(element);
  });
}

function handleLineBACKUP(line){
  //alert(line);
  var numberOfWhiteSpaces=line.match(/^[\s]*/g).length;
  var symbol=line[0];
  line=line.substring(1,line.length-1)
  line=line.split(',');
  
  switch(symbol){
    case '[':
      lastCategory=line[0];
      //addCategory();
      addCategory(lastCategory,line[1],line[2]);
      //alert("adding category "+getCategory("search engines").name);
      lastSite="";
    break;
    case '(':
      addSite(lastCategory,line[0],line[1],line[2],line[3]);
      lastSite=line[0];
      //alert("addin site "+line);
      //alert(getSite().name);
    break;
    case '{':
      //alert(line);
      addSubsite(lastSite,line[0],line[1],line[2],line[3]);
      //alert(getSubsite()[0].name);
    break;
    case '#':
      //alert("Adding coment! #"+line);
    break;
    case '/':
      //alert("Adding coment! /"+line);
    break;
    default:
      //alert("Error with file!");
  }
  
}

function handleLine(line){
  if(line.length==0)return false;
  var s=line.charAt(0);

  if(s=='[' || s=='(' || s=='{' || s=='#' || s=='/' || s=='\\'){
    line=line.substring(1,line.length-1)
    line=line.split(',');

    switch(s){
      case '[':
        lastCategory=line[0];
        //addCategory();
        addCategory(lastCategory,line[1],line[2]);
        //alert("adding category "+getCategory("search engines").name);
        lastSite="";
      break;
      case '(':
        addSite(lastCategory,line[0],line[1],line[2],line[3]);
        lastSite=line[0];
        //alert("addin site "+line);
        //alert(getSite().name);
      break;
      case '{':
        //alert(line);
        addSubsite(lastSite,line[0],line[1],line[2],line[3]);
        //alert(getSubsite()[0].name);
      break;
      case '#':
        //alert("Adding coment! #"+line);
      break;
      case '/':
        //alert("Adding coment! /"+line);
      break;
      default:
        //alert("Error with file!");
    }
  }else{
    var noOfWhite=line.search(/\S/);
    line=line.trim();
    //alert(noOfWhite+" "+line);
    line=line.split(',');
    
    switch(noOfWhite){
      case 0:
        //alert("new category"+line);
        lastCategory=line[0];
        addCategory(lastCategory,line[1],line[2]);
        lastSite="";
      break;
      case 1:
      case 4:
        //alert("new site"+line);
        addSite(lastCategory,line[0],line[1],line[2],line[3]);
        lastSite=line[0];
      break;
      case 2:
      case 8:
        //alert("new subsite"+line);
        addSubsite(lastSite,line[0],line[1],line[2],line[3]);
      break;
    }
  }
 //alert(line);
}

function addCategory(name,icon,color){
  category.push({
      name:name,
      icon:icon,
      color:color
    }
  );
}

function getCategory(name){
  if(name === undefined){
    return category;
  }else{
  return category.find(element => element.name == name);
  }
}

function addSite(category,name,adress,search,icon){
    if(adress === undefined){
      adress=name;
    }

    if(search!==undefined){
      if(search[0]=="/"){
        search=adress+search;
      }
    }

    site.push({
    category:category,
    name:name,
    adress:adress,
    search:search,
    icon:icon
  });
}

function getSite(name){
  if(name === undefined){
    return site;
  }else{
    return site.find(element => element.name == name);
  }
  
}
//reddit.org            -site
//          /r/uniporn  -name
function addSubsite(site,name,adress,search,icon){
  if(adress === undefined){
    if(name[0]=="/"){
      adress=getSite(site).adress+name;
    }else {
      adress=name;
    }
  }

  if(search!==undefined){
    if(adress[0]=="/"){
      adress=getSite(site).adress+adress;
    }
    if(search[0]=="/"){
      search=adress+search;
    }
  }

  subsite.push({
    site:site,
    name:name,
    adress:adress,
    search:search,
    icon:icon
  });
}

function getSubsite(name){
  if(name === undefined){
    return subsite;
  }else{
    return subsite.find(element => element.name == name);
  }
}

function countSitesOf(categoryName){
  return getSite().filter(e=>e.category==categoryName).length;
}

function countSubsitesOf(siteAdress){
  return getSubsite().filter(e=>e.site==siteAdress).length;
}

var x=0;
var y=0;

var xMax;
var yMax;

function setXandYonButtonClick(td){
  alert(td.id);
}

function createTable(){
  var targetDiv = document.getElementById("insert-links-here");

  for(var u=0;u<category.length;u++){
    var tableDiv=document.createElement("div");
    tableDiv.className="table-div";
    tableDiv.id=u;
    targetDiv.appendChild(tableDiv);

    var table=document.createElement("table");
    tableDiv.appendChild(table);

    
    var tr=document.createElement("tr");
    table.appendChild(tr);

    var th=document.createElement("th");
    th.innerHTML=category[u].name;
    tr.appendChild(th);
    table.appendChild(tr);

    

    /*
    var td=document.createElement("td");
    td.innerHTML='<button type="button">'+"Click Me!"+'</button>';
    tr.appendChild(td);
    */
    var index=0;

    for(var i=0;i<site.length;i++){
      if(site[i].category==category[u].name){
        //yMax+=site[i].name+" ";
        var tr=document.createElement("tr");
        table.appendChild(tr);
        
        var td=document.createElement("td");
        td.id=u+"x"+index;
        td.className="linkButton";
        var btn=document.createElement("button");
        btn.innerHTML=site[i].name;
        td.appendChild(btn);
        //td.innerHTML='<button type="button">'+site[i].name+'</button>';
        tr.appendChild(td);
        table.appendChild(tr);

        index++;
        
        for(var j=0;j<subsite.length;j++){
          if(subsite[j].site==site[i].name){
            var tr=document.createElement("tr");
            table.appendChild(tr);
            
            var td=document.createElement("td");
            td.id=u+"x"+index;
            td.className="linkButton";
            var btn=document.createElement("button");
            btn.innerHTML=subsite[j].name;
            td.appendChild(btn);
            //td.innerHTML='<button type="button">'+subsite[j].name+'</button>';
            tr.appendChild(td);
            table.appendChild(tr);

            index++;
          }
        }
      }
    }

  }
}

document.addEventListener('click', function(e) {
  e = e || window.event;
  if(e.target.parentElement.className=="linkButton"){
    var dimensions=e.target.parentElement.id;
    //alert(dimensions);
    dimensions=dimensions.split("x");
    deSelectLink();
    x=parseInt(dimensions[0]);
    y=parseInt(dimensions[1]);
    selectLink();
    search();
    //updateDevOutput();

  }
}, false);

/*  "search"-div with inputs is active
      <tab> (pressed and relased) - opens hidden text input, where you put site adress for custom search and focuses into it
      <enter> - launches same button as 'google search'
      <shift> + <enter> - launches feeling lucky search 
      <arrowDown> - changes active div to "links"

    "links"-div with list of links is selected  
      <arrowRight>/<arrowLeft> - switch between different categories
      <arrowDown>/<arrowUp> - 'jumps' into listo of links and activates selected ones
        <enter> - launches same button as 'google search'
        <shift> + <enter> - launches feeling lucky search     */

var Menu="search";
//Menu="link";

function updateDevOutput(){
  xMax=category.length;
  //yMax=countSubsitesOf(site[x].name);
  //yMax=countSitesOf(category[x].name);
  yMax=0;
  for(var i=0;i<site.length;i++){
    if(site[i].category==category[x].name){
      yMax++; //yMax+=site[i].name+" ";
      
      for(var j=0;j<subsite.length;j++){
        if(subsite[j].site==site[i].name)yMax++;//yMax+="[s]"+subsite[j].name+" ";
      }
    }
  }

  var temp="x:"+x+" y:"+y+" xMax:"+xMax+" yMax"+yMax+"<br>";
  document.getElementById('dev').innerHTML=temp+" "+Menu;
  //alert(temp);
}

function countLinksOfCategory(x){
  var temp=0;
  for(var i=0;i<site.length;i++){
    if(site[i].category==category[this.x].name){
      temp++; //yMax+=site[i].name+" ";
      
      for(var j=0;j<subsite.length;j++){
        if(subsite[j].site==site[i].name)temp++;//yMax+="[s]"+subsite[j].name+" ";
      }
    }
  }
  return temp;
}


document.addEventListener('keydown', function(event) {
  //on <enter> or <shift> launch searching querry. It always works no matter what Menu varaible state
  //if(document.activeElement.id=="searchQuerry"){
    //Menu="links"; document.activeElement.blur();

  if(event.key=="Enter"){
    search();
  }
  
  if(Menu=="search"){
    if(document.activeElement.value==""){
      if(event.key=="Tab" || event.key==" " || event.key=="ArrowDown" || event.key=="Backspace"){
        Menu="links";
        document.activeElement.blur();
      }
      //alert(event.location);
    }else{
      if(event.key=="Tab" || event.key=="ArrowDown"){
        Menu="links";
        document.activeElement.blur();
      }
    };
  }
  
  if(Menu=="links"){
    deSelectLink();
    //document.activeElement.blur();
    if(event.key == "ArrowLeft") {
      //alert('Left was pressed');
      if(x>0){
        x--;
        if(y>countLinksOfCategory(x+1)-1)y=countLinksOfCategory(x)-1;
      }
    }
    else if(event.key == "ArrowRight") {
      //alert('Left was pressed');
      if(x<xMax-1){
        x++;
        if(y>countLinksOfCategory(x-1)-1)y=countLinksOfCategory(x)-1;
      }
    }
    else if(event.key == "ArrowUp") {
      //alert('Left was pressed');
      if(y>0)y--;
    }
    else if(event.key == "ArrowDown") {
      //alert('Left was pressed');
      if(y<yMax-1)y++;
    }
    updateDevOutput()
    selectLink();
    
  }

  updateDevOutput()
});


///////////////////////////////
// Here action really begins
///////////////////////////////

function selectLink(){
  var selectedLink=document.getElementById(x+"x"+y);
  selectedLink.classList.add("selectedLink");
  Menu="links";
}
function deSelectLink(){
  var selectedLink=document.getElementById(x+"x"+y);
  selectedLink.classList.remove("selectedLink");
}

function search(){
  var querry=document.getElementById("searchQuerry").value;
  var name=document.getElementById(x+"x"+y).firstChild.innerHTML;
  var site=getSite(name) || getSubsite(name);

  if(Menu=="search"){
    if(querry==""){
      alert("What You want me to do?!");
    }else{
      //alert("Searching '"+querry+"' using default search engine "+searchEngine[0].search+" "+"http://"+searchEngine[0].search+encodeURI(querry));
      window.location.href ="http://"+encodeURI(searchEngine[0].search+querry);
    }
  }else if(Menu=="links"){
    if(querry==""){
      window.location.href = "http://"+encodeURI(site.adress);
      //alert("Redirecting You to:"+site.adress);
    }else{
      if(site.search===undefined){
        //alert("Searching '"+querry+"' using default search engine and 'site:' option");
        window.location.href ="http://"+encodeURI(searchEngine[0].search+'site:'+site.adress+" "+querry);
      }else{
        //var tempSearch=site.search+querry;
        //alert("Searching '"+querry+"' using site search by link "+tempSearch);
        var tempSearch=site.search;
        if(site.search.includes("QUERRY")){
          tempSearch=tempSearch.replace('QUERRY',querry);
          //alert("Going to Querred "+tempSearch)
        }else{
          tempSearch=site.search+querry;
          //alert("Going to "+site.search+querry);
        }
        //alert("Going to "+tempSearch);
        window.location.href ="http://"+encodeURI(tempSearch);
      }
    }
  }else{
    alert("error in search function!");
  }
  
  //alert(Menu+" "+querry+" "+site.adress);
}

/////////////////////////////////
// printing html table
///////////////////////////
/*
for(var i=0;i<site.length;i++){
  if(site[i].category==category[x].name){
    yMax+=site[i].name+" ";
    
    for(var j=0;j<subsite.length;j++){
      if(subsite[j].site==site[i].name)yMax+="[s]"+subsite[j].name+" ";
    }
  }
}

document.addEventListener('keydown', function(event) {
  
  //alert(site.length);

  if(event.key == "ArrowLeft") {
    //alert('Left was pressed');
    if(x>0){
      x--;
    }
    
  }
  else if(event.key == "ArrowRight") {
    //alert('Left was pressed');
    if(x<xMax-1){
      x++;
    }
    
  }
  else if(event.key == "ArrowUp") {
    //alert('Left was pressed');
    if(y>0)y--;
  }
  else if(event.key == "ArrowDown") {
    //alert('Left was pressed');
    if(y<yMax-1)y++;
  }

  updateDevOutput()
});
*/


window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if([  38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
  }
}, false);
