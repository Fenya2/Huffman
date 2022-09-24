
function makeSeries(sequence) {
    let series = {};
    for(let i = 0; i < sequence.length; i++) {
        if(!series[sequence.charAt(i)]) series[sequence.charAt(i)] = 1;
        else series[sequence.charAt(i)]++;
    }
    return Object.entries(series);
}

function TreeNode(letter, weight, parent, sons, num, isUsed) { //parent and Sons([]) must have a Node type
    this.letter = letter;
    this.weight = weight;
    this.parent = parent;
    this.sons = sons;
    this.num = num;
    this.isUsed = isUsed;
}

function makeLeaves(series) {
    let leaves = [series.length];
    for(let i = 0; i < series.length; i++) {
        leaves[i] = new TreeNode(series[i][0], series[i][1], null, null, null, false); //num param sets in a tree
    }
    return leaves;
}

function Tree(treeLeaves) {
    this.treeLeaves = treeLeaves;
    this.tree = [];
    this.have2UnusedNodes = function () {
        let counter = 0;
        for(let i = 0; i < this.tree.length; i++) {
            if(!this.tree[i].isUsed) counter++;
            if(counter === 2) return true;
        }
        return false;
    }
    this.getLetterCode = function (code, sonNode) { // argument is leave
        this.code = code;
        if(sonNode.parent === null) {
           return this.code.split("").reverse().join().replace(/[\s.,%]/g, '');
        }
        if(sonNode.parent.sons[0].num  === sonNode.num) {
            return this.getLetterCode(this.code+='0', sonNode.parent);
        }
        else if(sonNode.parent.sons[1].num  === sonNode.num) {
            return this.getLetterCode(this.code+='1', sonNode.parent);
        }
    }
    this.generateCodeTable =  function () {
        let codeTable = {};
        for(let i = 0; i < this.treeLeaves.length; i++) {
            codeTable[`${this.tree[i].letter}`] = this.getLetterCode('', this.tree[i]);
        }
        return codeTable;
    }
    this.getCodeTable = function () {
        return this.generateCodeTable();
    }
    for(let i = 0; i < this.treeLeaves.length; i++) { // add leaves
        treeLeaves[i].num = i;
        this.tree.push(treeLeaves[i]);
    }
    while (this.have2UnusedNodes()) { // tree creating
        let unusedNodes = [];
        for (let i = 0; i < this.tree.length; i++) {
            if (!this.tree[i].isUsed) {
                unusedNodes.push(this.tree[i]);
            }
        }
        let NodesWeights = new Array(unusedNodes.length);
        for (let i = 0; i < unusedNodes.length; i++) {
            NodesWeights[i] = unusedNodes[i].weight;
        }
        let minWeightsIndexes = get2minimalNumsIndexes(NodesWeights);
        let son1 = unusedNodes[minWeightsIndexes[0]];
        let son2 = unusedNodes[minWeightsIndexes[1]];
        let sons = [son1, son2];
        let sonsWeight = sum(son1.weight, son2.weight);

        this.tree.push(new TreeNode(`${son1.letter}${son2.letter}`, sonsWeight, null, sons, 0, false));
        this.tree[this.tree.length-1].num = this.tree.length - 1;
        this.tree[son1.num].isUsed = true;
        this.tree[son2.num].isUsed = true;
        this.tree[son1.num].parent = this.tree[this.tree.length - 1];
        this.tree[son2.num].parent = this.tree[this.tree.length - 1];
        //console.log(this.tree);
    }
}

function HuffmansCoder(codeTable) {
    this.codeTable = codeTable;
    this.decodeTable = {};
    Object.entries(codeTable).forEach((value) =>{
        this.decodeTable[value[1]] = value[0];
    })
    this.encode = function (inputSequence, fileName) {
        let outputSequence =  '';
        for(let i = 0; i < inputSequence.length; i++) {
            if(this.codeTable[`${inputSequence.charAt(i)}`]) {
                outputSequence += this.codeTable[`${inputSequence.charAt(i)}`];
            }
            else throw Error(`there is not [${inputSequence.charAt(i)}] symbol in code table`);
        }
        // WRITE IN FILE.
        // the fist byte of file contains, how much bits of file's last byte not enter into an encoded sequence.
        let divisionRemainder = outputSequence.length % 8;

        return outputSequence;
    }
    this.decode = function (inputSequence, fileName) { //todo сделать побитовое чтение файла
        let outputSequence = '';
        for(let i = 0; i < inputSequence.length; i++) {
            let charCodeFound = false;
            let charCode = '';
            while (!charCodeFound) {
                charCode += inputSequence.charAt(i);
                if(this.decodeTable[`${charCode}`]){
                    outputSequence += this.decodeTable[`${charCode}`];
                    charCodeFound = true;
                }
                else i++;
            }
        }
        //divisionReminder = outputSequence.length % 8;

        return outputSequence;
    }
}



function get2minimalNumsIndexes(nums) { //min nums.length - 3. Return minimal nums indexes in array(minmin, min)
    let minmin = nums[0] <= nums[1] ? [0,nums[0]] : [1, nums[1]]; // [index in nums, value]
    let min = minmin[1] === nums[0] ? [1,nums[1]] : [0, nums[0]]; // [index in nums, value]
    for(let i = 2; i < nums.length; i++) {
        if(minmin[1] > nums[i]) {
            min = minmin;
            minmin = [i,nums[i]];
        }
        else if(min[1] > nums[i]) min = [i, nums[i]];
    }
    return [minmin[0],min[0]];
}

function sum(a,b) {
    return a+b;
}

let inputSequence = "abrakadabra";
let series = makeSeries(inputSequence);
console.log(inputSequence.length);
let leaves = makeLeaves(series);
console.log(series);
let tree = new Tree(leaves);
let codeTable = tree.getCodeTable();
coder = new HuffmansCoder(codeTable);
console.log(coder.codeTable);
codedSequence = coder.encode(inputSequence);
console.log(codedSequence);