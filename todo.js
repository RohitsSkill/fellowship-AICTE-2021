const fs = require("fs");
const readline = require("readline");

const todo = 'todo.text';
const done = 'done.txt';

fs.appendFile(todo,"",(err)=>{
    if(err){
        console.log(err);
    }
})

deleteTask = (id) => {
    var rd = readline.createInterface({
        input: fs.createReadStream(todo)
    });
    let i = 1;
    rd.on('line',(line)=> {
        if(i == parseInt(id)){
            fs.readFile(todo, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    throw err
                };
                var arr = data.split('\n');
                fs.writeFile(todo, data.replace(arr[parseInt(id)-1]+'\n',""), 'utf8', ()=>{
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });
            })
        }
        i++;
    });
}

addTask = (task) => {
    fs.readFile(todo, 'utf8', (err, data) => {
        
        if(!data.match(`${task}\n`)){
            fs.appendFile(todo,`${task}\n`,(err)=>{
                if(err){
                    console.log(err);
                }
            });
        }
    })
}

doneTask = (id) =>{
    var rd = readline.createInterface({
        input: fs.createReadStream(todo)
    });
    let i = 1;
    rd.on('line',(line)=> {
        if(i==parseInt(id)){
            var date = new Date();
            fs.appendFile(done,`x ${date.toISOString().slice(0,10)} ${line} \n`,(err,res)=>{
                fs.readFile(todo,(err,data)=>{
                    if(err){
                        console.info(err);
                    }
                    else{
                        console.info(`Marked todo #${id} as done.`);
                    }
                });
            });
            
            fs.readFile(todo, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    throw err
                };
                var arr = data.split('\n');
                fs.writeFile(todo, data.replace(arr[parseInt(id)-1]+'\n',""), 'utf8', ()=>{
                    if (err) {
                        console.log(err);
                        throw err
                    };
                });
            })
        }
        i++;
    });
}

getReport = () => {
    fs.readFile(todo, 'utf8', (err, data) => {
        if (err) throw err;

        var lines = data. split("\n");
        let rem = lines.length;
        
        fs.readFile(done, 'utf8', (err, data) => {
            if (err) throw err;
    
            var lines = data. split("\n");
            let com = lines.length;
            const date = new Date();
            console.log(`${date.toISOString().slice(0, 10)} Pending : ${rem-1} Completed : ${com-1}`)
         });
    });
}



printTasks = () => {
    fs.readFile(todo, 'utf8', (err, data) => {
        if (err) throw err;
       
        var lines = data.split('\n');
        if(lines.length==1||lines.length==0){
            console.log(`There are no pending todos!`);
        }
        else{
            for(let i = lines.length-1;i>0;i--){
                console.log(`  [${i}] ${lines[i-1]}`);
            }
        }
    })
}

printHelp = () => {
    console.info(`Usage :-\n$ ./todo add "todo item"  # Add a new todo\n$ ./todo ls               # Show remaining todos\n$ ./todo del NUMBER       # Delete a todo\n$ ./todo done NUMBER      # Complete a todo\n$ ./todo help             # Show usage\n$ ./todo report           # Statistics`);
}


var arg = process.argv;
// to add the new task
if(arg[2]=='add'){
    if(arg[3]===undefined){
        console.info('Error: Missing todo string. Nothing added!');
    }
    else{
        addTask(arg[3]);
        console.log(`Added todo: "${arg[3]}"`);
    }
}

//print help when non arg is provided
if(arg[2]==undefined){
    printHelp();
}

//print help
if(arg[2]=="help"){
    printHelp();
}

//delete task
if(arg[2]=="del"){
    if(arg[3]===undefined){
        console.info('Error: Missing NUMBER for deleting todo.');
    }
    else{
        fs.readFile(todo, 'utf8', (err, data) => {
            if (err) throw err;
    
            var lines = data. split("\n");
            if(lines.length<=arg[3] || arg[3]==0){
                console.info(`Error: todo #${arg[3]} does not exist. Nothing deleted.`);
            }
            else    
                deleteTask(arg[3]);
        })
        console.log(`Deleted todo #${arg[3]}`)
    }
}

//complete task
if(arg[2]=="done"){
    if(arg[3]===undefined){
        console.info('Error: Missing NUMBER for marking todo as done.');
    }
    else{
        fs.readFile(todo, 'utf8', (err, data) => {
            if (err) throw err;
    
            var lines = data. split("\n");
            if(lines.length<=arg[3] || arg[3]==0){
                console.info(`Error: todo #${arg[3]} does not exist. Nothing completed.`);
            }
            else    
                doneTask(arg[3]);
        })
    }
}

//list all pending todo
if(arg[2]=="ls"){
    printTasks();
}
// print report status
if(arg[2]=="report"){
    getReport();
}
//program.parse(argv);