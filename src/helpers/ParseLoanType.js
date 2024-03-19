export default function parseLoanType(type){
    let res;
    switch(type){
        case "AL":
            res="New Car Loan";
            break;
        case "BL":
            res= "Business Loan Unsecured";
            break;
        case "CC":
            res= "Credit Cards";
            break;
        case "GL":
            res= "Gold Loan";
            break;
        case "HL":
            res= "Home Loan";
            break;
        case "LAP":
            res= "Loan Against Property";
            break;
        case "PL":
            res= "Personal Loan";
            break;
        case "UCL":
            res= "Used Car Loan";
            break;
        default:
            res= "Personal Loan";
            break;
    }

    return res;
}