
module.exports =  class KeywordGeneration {
    static createKeywords(name){
        const arrName= [];
        let curName= "";
        name.split("").forEach(letter => {
            curName += letter.toLowerCase();
            arrName.push(curName.toLowerCase());
        })
        console.log(name);
        return arrName;
        
    }

    static generateKeywords(names){
        let arrOfName = names.split(" ");
        let objOfSets = {};
        let previous = "";
        let newSet = []
        let finalSet = [];
        for(let i =0; i<arrOfName.length; i++){
            newSet.push(KeywordGeneration.createKeywords(arrOfName[i].toLowerCase()))
            for(let j = 0; j<arrOfName.length; j++){
                if(j > i){
                    previous = previous !== ""?previous + " " + arrOfName[j].toLowerCase():arrOfName[j].toLowerCase();
                newSet.push(KeywordGeneration.createKeywords(arrOfName[i].toLowerCase() + " " + previous))
                }
            }
            previous = "";
        }
    

        for(let i = 0; i <newSet.length; i++){
           finalSet = finalSet.concat(newSet[i])
        }

        let filteredArr = [];

        finalSet.map((e,i) =>{
            if(!filteredArr.includes(e)){
                filteredArr.push(e);
            }

        })

    
        return filteredArr;
    }
}
