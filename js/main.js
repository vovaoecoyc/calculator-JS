$(document).ready(function(){
    
    //console.log($.fn.jquery);
    
    $('table tbody tr:eq(4) td:eq(1) input').prop("disabled", true);
    $('table tbody tr:eq(4) td:eq(2) input').prop("disabled", true);
    $('table tbody tr:eq(4) td:eq(3) input').prop("disabled", true);
    
    var operations = {
        add:        "+",
        sub:        "-",
        mul:        "*",
        div:        "/",
        priority: function(sign){
            switch(sign){
                case '+':
                    return 1;
                case '*':
                    return 2;
                case '-':
                    return 1;
                case '/':
                    return 2;
                default:
                    return false;
            }
        },
        getSubResult: function(operandFirst, sign, operandSecond){
            switch(sign){
                case '+':
                    return (Number(operandFirst) + Number(operandSecond));
                case '*':
                    return (Number(operandFirst) * Number(operandSecond));
                case '-':
                    return (Number(operandFirst) - Number(operandSecond));
                case '/':
                    if(operandSecond !== 0)
                        return (Number(operandFirst) / Number(operandSecond));
                    else return 0;
            }
        }
    }
    
    var subOperations = {
        mantissa:   ".",
        equally:    "=",
        clear:      "C",
        percent:    "%",
        sqrt:       "&#8730",
        del:        "DEL"
    }
    
    var data = [];

    //saved result calculated be there
    var result = 0;
    
    localStorage.setItem('operand', '');
    localStorage.setItem('sign', '');
    
    function checkOnOperations(inputChar, inputObject){
        
        for(let k in inputObject){
            if(inputObject[k] === inputChar)
                return true;
        }
        return false;       
    }
    
    //checked double mantissa in string
    function checkMantissa(str, mantissa){
        
        for(let i = 0; i < str.length; i++){
            if(str[i] === mantissa){
                return true;
            }
        }
        return false;
        
    }
    
    //console.log(85.45);
    var buttons = document.querySelectorAll('input[type=button]');
    var flag = true;
    for(var i = 0; i < buttons.length; i++){
        if(!isNaN(+buttons[i].value) || buttons[i].value === subOperations.mantissa){
            buttons[i].addEventListener("click", function(e){
                
                if(localStorage.getItem('sign') !== ''){
                    data.push(localStorage.getItem('sign'));
                    //claer sign
                    localStorage.setItem('sign', '');
                }
                else{
                    //data.pop();
                }
                
                if(e.target.value === subOperations.mantissa){
                    if(!checkMantissa(localStorage.getItem('operand'), subOperations.mantissa)){
                        document.querySelector('input[type=text]').value += e.target.value;
                        localStorage.setItem('operand', localStorage.getItem('operand') + e.target.value);
                    }
                }
                else{
                    document.querySelector('input[type=text]').value += e.target.value;
                    localStorage.setItem('operand', localStorage.getItem('operand') + e.target.value);
                }
                console.log(JSON.stringify(data));
                
                
            });
        }
        else if(checkOnOperations(buttons[i].value, operations)){
            
                buttons[i].addEventListener("click", function(e){
                    
                    //push operand in array of data for calculate and claer date of opernad
                    if(localStorage.getItem('operand') !== ''){
                        data.push(localStorage.getItem('operand'));
                        localStorage.setItem('operand', '');
                    }
                    
                    var expr = document.querySelector('input[type=text]').value;
                    flag = true;
                    //checking first char is minus
                    if(expr.length > 0) {
                        localStorage.setItem('sign', e.target.value);
                        if(expr.length == 1 && expr[0] === operations.sub){
                            document.querySelector('input[type=text]').value = expr;
                        }
                        else{
                            //replace last sumbol(*+/-) in string if we press button with (*+/-)
                            for(let key in operations){
                                if(operations[key] === expr.charAt(expr.length-1)){
                                    expr = expr.slice(0, expr.length-1) + e.target.value;
                                    document.querySelector('input[type=text]').value = expr;
                                    flag = false;
                                    break;
                                }
                                else continue;
                            }
                            if(flag){
                                
                                document.querySelector('input[type=text]').value += e.target.value;
                                
                            }
                        }
                    }
                    else {
                        if(e.target.value === operations.sub){
                            document.querySelector('input[type=text]').value = e.target.value;
                            //if(localStorage.getItem('sign') )
                            localStorage.setItem('sign', e.target.value);
                        }
                        else{
                            document.querySelector('input[type=text]').value = '';
                        }
                    }
                    
                    //building the array of data for calculate
                    localStorage.setItem('sign', e.target.value);
                });
                
                
        }
        else if(buttons[i].value === subOperations.equally){
            
            buttons[i].addEventListener("click", function(e){
                
                //push last operand and sign of data for calculate
                if(localStorage.getItem('operand') !== ''){
                    data.push(localStorage.getItem('operand'));
                }
                if(localStorage.getItem('sign') !== ''){
                    data.push(localStorage.getItem('sign'));
                }
                
                //if last element is sign - delete this
                if(checkOnOperations(data[data.length-1], operations)){
                    data.pop();
                }

                /*make calculate
                    *****************************
                    *****************************
                */
                
                //replace operand like dots(".") on zero
                for(var j = 0; j < data.length; j++){
                    
                    if(data[j] === "."){
                        data.splice(j, 1, "0");
                    }
                    
                }
                
                if(checkOnOperations(data[0], operations)){
                    data.splice(0,1);
                    data[0] = -data[0];
                }
                
                //check existence sings priority in data array
                var haveFirst = false; haveSecond = false;
                for(var k = 0; k < data.length; ++k){
                    if(checkOnOperations(data[k], operations)){
                        if(operations.priority(data[k]) == 1){
                            haveFirst = true;
                        }
                        if(operations.priority(data[k]) == 2){
                            haveSecond = true;
                        }
                    }
                }
                
                // calculate for hign priority sings ( do this if we have two priority signs in array )
                if(haveFirst && haveSecond){
                    for(var j = 0; j < data.length; ++j){
                        if(checkOnOperations(data[j], operations)){
                            if(operations.priority(data[j]) == 2){
                                result = operations.getSubResult(data[j - 1],  data[j], data[j + 1]);
                                data.splice(j-1, 3, result);
                                result = 0;
                                j = 0;
                            }
                        }
                    }
                }
                
                //calculate finaly result 
                var firstIter = true;
                for(j = 0; j < data.length; ++j){
                    if(checkOnOperations(data[j], operations)){
                        if(firstIter){
                            result = operations.getSubResult(data[j - 1], data[j], data[j + 1]);
                            firstIter = false;
                        }
                        else{
                            result = operations.getSubResult(result, data[j], data[j + 1]);
                        }
                    }
                    else{
                        
                    }
                }
                
                
                
                document.querySelector('input[type=text]').value = Math.round(result * 100000) / 100000;
                
                //log
                console.log(JSON.stringify(data));
                console.log(result);
                
                
                //claer all data
                //document.querySelector('input[type=text]').value = '';
                data = [];
                localStorage.setItem('operand', result);
                localStorage.setItem('sign', '');
            });
        }
        else if(buttons[i].value === subOperations.clear){
            
                buttons[i].addEventListener("click", function(e){
                
                    document.querySelector('input[type=text]').value = '';
                    data = [];
                    localStorage.setItem('operand', '');
                    localStorage.setItem('sign', '');
                });
        }
        else if(buttons[i].value === subOperations.del){
            
                buttons[i].addEventListener("click", function(e){
                
                    var inputStr, locSign, locOperand;
                    inputStr = document.querySelector('input[type=text]').value;
                    inputStr = inputStr.slice(0, inputStr.length - 1);
                    document.querySelector('input[type=text]').value = inputStr;

                    if(checkOnOperations(inputStr[inputStr.length - 1], operations)){
                        locSign = localStorage.getItem('sign');
                        locSign = locSign.slice(0, locSign.length - 1);
                        localStorage.setItem('sign', locSign);
                    }
                    else{
                        locOperand = localStorage.getItem('operand');
                        locOperand = locOperand.slice(0, locOperand.length - 1);
                        localStorage.setItem('operand', locOperand);
                    }
            });
        }
            
    }
    
    
});
