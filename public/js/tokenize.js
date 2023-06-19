export const tokenize = (str) => {
    var _str = []
    var len = str.length
    
    var temp = ""
    for(var i = 0;i <= len;i++){
        if(i == len){
            _str.push(temp)
            continue
        }
        if(str[i] === ','){
            
            _str.push(temp);
            temp = ""
            continue
        }
        if(str[i] === ' '){
            continue
        }
        
        temp+=(str.substring(i,i+1));
    }
    return _str
}
// console.log('performing unit testing....')
// const intr = "run, read,cricket"
// tokenize(intr).forEach(e => {
//     console.log(e)
// });