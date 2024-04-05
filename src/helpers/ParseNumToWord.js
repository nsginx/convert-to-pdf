function parseNumToWord(num){
    num= parseInt(num);
    if(num>9999999){
        return parseFloat(num/10000000).toFixed(2).toString().concat(" Cr.")
    }
    else if(num>99999){
        return parseFloat(num/100000).toFixed(2).toString().concat(" Lakh")
    }
    else if(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    }else{
        return num;
    }
}

export default parseNumToWord;