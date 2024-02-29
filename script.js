// access all elemnt
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_,.<>/?}{[\-]|';
// default case value
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");

//set PasswordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadoww
    //home workadd krna hai
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
//random integer
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;

}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
// password strength function
function calcStrenght(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if (uppercaseCheck.checked) {
        hasUpper=true;
        }
        if (lowercaseCheck.checked) {
            hasLower=true;
            }

        if (numbersCheck.checked) {
            hasNum=true;
            }

        if (symbolsCheck.checked) {
            hasSym=true;
            }
        
            if(hasUpper && hasLower && (hasNum||hasSym)&&passwordLength>=8){
                setIndicator('#0f0');
            }
            else if ((hasLower||hasUpper)&&
                    (hasNum||hasSym)&&
                    passwordLength>=6) {
                setIndicator('#ff0');
            }
            else{
                setIndicator('#f00');
            }

}
// function copy content
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make copy vala span visibla

    copyMsg.classList.add("active");

    //set timeout
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
//suffle function
function sufflePassword(array)
{
    //for fisher yates method
    for(let i=array.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp= array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
    
}


//count check box
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });
    //special condition
    if (passwordLength<checkCount) {
        passwordLength=checkCount;
        handleSlider();
    }
}


allCheckBox.forEach( (checkbox) =>{
      checkbox.addEventListener('change',handleCheckBoxChange);
})

//event listner on slider
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

//copy Event Listner
copyBtn.addEventListener('click',()=>{
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    //yadi ek bhi check box selected nhi hai to

    if(checkCount<=0){
        return;
    }
    //if password lenth slider is less than check count
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //lets start the new password journey

        //remove old password
        password="";

            //lets put the value mantioned by checkboxes
        
        // if (uppercaseCheck.checked) {
        //     password+=generateUpperCase();            
        // }

        // if (lowercaseCheck.checked) {
        //     password+=generateLowerCase();            
        // }

        // if (numbersCheck.checked) {
        //     password+=generateRandomNumber();            
        // }

        // if (symbols.checked) {
        //     password+=generateSymbols();            
        // }

        let funcArr=[];
        
        if (uppercaseCheck.checked) {
            funcArr.push(generateUpperCase);
                 }
        if (lowercaseCheck.checked) {
            funcArr.push(generateLowerCase);
                 }
        if (numbersCheck.checked) {
            funcArr.push(generateRandomNumber);
                 }
        if (symbolsCheck.checked) {
            funcArr.push(generateSymbol);
                }
        
            //compolsory adition
        for(let i=0; i<funcArr.length; i++)
        {
            password+=funcArr[i]();
        }

        //remaining addition
        for (let  i= 0;  i<passwordLength-funcArr.length; i++) {
            let randIndex=getRndInteger(0,funcArr.length);
            password+=funcArr[randIndex]();
        }
        //shuffle the password
        password=sufflePassword(Array.from(password));
        //password display
        passwordDisplay.value=password;

        //calculate strength
        calcStrenght();
    
    })