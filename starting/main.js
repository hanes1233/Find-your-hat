var rows = 0;
var cols = 0;
var winner = false;
var collision = false;
var holeDrop = false;

//Importing prompt for user's input and terminal-kit for design
const prompt = require('prompt-sync')({sigint : true});
var term = require( 'terminal-kit' ).terminal ;

//Getting user's input to perform game
function getUsersInput() {
term.cyan('Welcome! To start game, choose level: \n');
term.green('Easy = e \n');
term.yellow('Medium = m \n');
term.red('Hard = h \n');
const answer = prompt(term.cyan('Enter answer here : '));
//Depends on chosen level, create new Field instance with parameters of height,width and percentage of holes
    if(answer == 'e') {
        const easyGame = new Field(Field.generateField(25,25,5));
        easyGame.print();
        //Call run method with new-created instance
        run(easyGame);
    }else if(answer == 'm') {
        const mediumGame = new Field(Field.generateField(30,30,25));
        mediumGame.print();
        run(mediumGame);
    }else if(answer == 'h') {
        const hardGame = new Field(Field.generateField(50,50,41));
        hardGame.print();
        run(hardGame);
    }else {
        console.log('Choose game level with appropriate character.');
        //If input doesn't match 'e', 'm', or 'h' call recursion on getUsersInput function
        getUsersInput();
    }
    }

//Run game logic, taking Field instance as parameter
function run(game) {
//Taking user's input for next step
let input = prompt('Where to move next? W=up, S=down, A=left, D=right');

//Clear console of previous output
console.clear();
//Call modifyArray nested function on Field instance with user's input,rows and cols values
game.modifyArray(input,rows,cols);
//Printing new array after modifying
console.log(game.print());
//Checking if - else if user become winner,fall into hole or get collision and exit game
    if(winner == true) {
        term.green('Congratulations! You win the game! \n');
        process.exit();
    }else if(collision == true) {
        term.red('Collision.Game over! \n');
        process.exit();
    }else if(holeDrop == true) {
        term.red('WOAAAAAAAAAAAA!! You\'ve fall into hole.... \n');
        process.exit();
    }else {
        //else block calls recursion on run function and continue the game
        run(game);
    }
}


//Variables to perform our game
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//class defines our game-array
class Field {
    constructor(field) {this._field = field;}
    get field() {return this._field;}
    set field(field) {this._field = field;}
//Prints join array (string) to console, not modifying this._field variable
    print() {
        const joinedArray = [];
        for(let i = 0; i < this.field.length; i++) {
            joinedArray.push(this._field[i].join(''));
        }
        console.log(joinedArray);
    }
    //Generate array with provided parameters
    static generateField(height,width,percentage) {
        let finalArray = [];
        //Calculate how much holes must be in game
        let holes = percentage/100*width;
        //Create field for array
        const newField = (width) => {
            let array = [];
            for(let i = 0; i < width; i++) {
                //Fill all field with fieldCharachters
                array.push(fieldCharacter);
                }
                let index = 0;
                while(index < holes) {
                    //Refill random elements of field array with hole variable
                    array[Math.floor(Math.random() * width)] = hole;
                    index++;
                }
                return array;
        }
        //Create two-dimensional array, pushing fields in
        for(let j = 0; j < height; j++) { finalArray.push(newField(width)); }
        //Calculate random position of users appearance with rows and cols random values
        rows = Math.floor(Math.random() * height);
        cols = Math.floor(Math.random() * width)
        finalArray[rows][cols] = pathCharacter;
        //Calculate random position of hat symbol (winning position)
        finalArray[Math.floor(Math.random() * width)][Math.floor(Math.random() * height)] = hat;
        return finalArray;
    }

    //Modifying array depending on users input value; row and column here means user's start position in array(game)
    modifyArray(input,row,column) {
        switch(input) {
            case 'w':
                if(row == 0) {
                    return collision = true;
                }else if(this._field[row-1][column] == hole) {
                    return holeDrop = true;
                }else if(this._field[row-1][column] == hat) {
                    return winner = true;
                }else {
                    this._field[row-1][column] = pathCharacter;
                    return rows--;
                }
            case 's':
                if(row == this._field.length-1) {
                    return collision = true;
                }else if(this._field[row+1][column] == hole) {
                    return holeDrop = true;
                }else if(this._field[row+1][column] == hat) {
                    return winner = true;
                }else {
                    this._field[row+1][column] = pathCharacter;
                    return rows++;
                }
            case 'd':
                if(column == this._field[0].length-1) {
                    return collision = true;
                }else if(this._field[row][column+1] == hole) {
                    return holeDrop = true;
                }else if(this._field[row][column+1] == hat) {
                    return winner = true;
                }else {
                    this._field[row][column+1] = pathCharacter;
                    return cols++;
                }
            case 'a':
                if(column == 0) {
                    return collision = true;
                }else if(this._field[row][column-1] == hole) {
                    return holeDrop = true;
                }else if(this._field[row][column-1] == hat) {
                    return winner = true;
                }else {
                    this._field[row][column-1] = pathCharacter;
                    return cols--;
                }
            default:
                term.blue('Choose A, W , D or S \n');
                return true;
        }
    }
}

getUsersInput();