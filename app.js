

var budgetController = (function(){
    var Expenses= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
        this.percentage=-3;
    }

    Expenses.prototype.calcPercentage= function(totalIncome){
        if(totalIncome>0)
        {
            this.percentage= Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
    }
    Expenses.prototype.getPercentage= function(){
        return this.percentage;
    }

    var Income= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
    }

    var calculateTotal= function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value; 
        });
        data.totals[type]= sum;
    }
   
    var data={
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0, 
            inc:0,
        },
        budget: 0,
        percent: -1
    };
    //returns a public propertie
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            //ID= last ID + 1
            if(data.allItems[type].length>0){
                ID= data.allItems[type][data.allItems[type].length -1].id +1;
            }
            else{
                ID=0;
            }
            if(type==='exp'){
                newItem= new Expenses(ID, des, val);
            }
            else if(type==='inc'){
                newItem= new Income(ID,des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, Id){
            var ids, index, i;
            //the difference between map and for each is that map returns an array
            ids=data.allItems[type].map(function(current){
                return current.id;
                //returns an array with the id items from all items 
            });
            index= ids.indexOf(Id);
            if(index!=-1){
                //splice(position, quantity of items to remove)
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            //calculate total expenses and incomes
            calculateTotal('exp');
            calculateTotal('inc');
           //calculate the budget 
           data.budget= data.totals.inc- data.totals.exp;
           //calculate the percentage of income that we spent
           if(data.totals.inc>0)
           {data.percent= data.totals.exp/data.totals.inc}
           else{
               data.percent=-1
           }
        },

        calculatePercentage: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },
        //DÚVIDA
        //
        //
        getPercentages: function(){
            var allPerc= data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return allPerc;
        },

        getBudget: function() {
            return{
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percent
            }
        }
        
    }

})();

var UIController = (function(){
    var DOMstrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLable: '.budget__value',
        incomeLable:'.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber= function(num, type)
    {
        let numSplit, int, dec;

        num=Math.abs(num);
        num=num.toFixed(2);
        numSplit= num.split('.');
            
        int=numSplit[0];
        dec=numSplit[1];
        if(int.length>3){
            int=int.substr(0, int.length-3)+","+int.substr(int.length-3, int.length);
        }
        return int+'.'+dec;
    };

    var nodeListForEach= function(list, callback ){
        for(var i=0; i<list.length; i++){
            callback(list[i],i)
        }
    }

    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        }, 
        getDOMstrings: function(){
            return DOMstrings;
        },

            addListItem: function(obj, type) {
            var html, element;
            //CREATE HTML STRING WITH PLACEHOLDER TEXT

            if(type==='inc'){
                element= DOMstrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element= DOMstrings.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder text with some actual text

            var newHtml= html.replace('%id%', obj.id);
            newHtml= newHtml.replace('%description%', obj.description);
            newHtml= newHtml.replace('%value%', formatNumber(obj.value, type));  
            newHtml= newHtml.replace('%percentage%', obj.percentage)

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
        },
        deleteListItem: function(selectorID){
            var element= document.getElementById(selectorID);
            document.getElementById(selectorID).parentNode.removeChild(element);      
        },


        clearFields: function(){
            var fields, fieldsArray;
            //selectorAll returns a list
            fields= document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);

            //slice is in prototype propertie of ARRAY
            //call substitui um objeto pelo atual parametro-0bjeto
            fieldsArray= Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array) {
                current.value= "";
            });
            fieldsArray[0].focus();

            //
        },
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLable).textContent= formatNumber(obj.budget);
            document.querySelector(DOMstrings.incomeLable).textContent= formatNumber(obj.totalInc);
            document.querySelector(DOMstrings.expensesLable).textContent= formatNumber(obj.totalExp);
            if(obj.percentage>0)
            { 
                document.querySelector(DOMstrings.percentageLabel).textContent= formatNumber(obj.percentage*100)+'%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---'
            }
        },
        
        displayPercentages: function(percentages){
            var fields= document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index){
                if(percentages[index]>0){
                    current.textContent= percentages[index]+'%';
                } else {
                    current.textContent='---';
                }
            });
        },

        displayDate: function(x){
            let date= new Date();
            var month= date.getMonth();
            let year= date.getFullYear();
            let months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month=months[month];
            document.querySelector(x).textContent=month+","+year;            
        },

        changeInput: ()=>{
            var fields=document.querySelectorAll(DOMstrings.inputType+','+DOMstrings.inputValue+','+DOMstrings.inputDescription);
            nodeListForEach(fields, (current)=>{
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        }
    }
})();


var controller = (function(budgetCtrl, UICtrl){
    var setUpEventListeners= function(){
        var DOM= UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
                if(event.keyCode===13){
                    ctrlAddItem();
                }
        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeInput);
    };

    var updateBudget= function(){
        //1. CALCULATE THE BUDGET
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget= budgetCtrl.getBudget();
        //3. DISPLAY THE BUDGET ON THE UI
        UICtrl.displayBudget(budget);
    }
    
    var updatePercentages= function(){
        //calculate percentages
        budgetCtrl.calculatePercentage();
        //read percentages from the budget controller
        var percentages= budgetCtrl.getPercentages();
        //update the UI with the percentages 
        UICtrl.displayPercentages(percentages);
    }


    var ctrlAddItem= function(){
        var input, newItem;

        //1. GET THE FIELD INPUT DATA
        input= UICtrl.getInput();
        //2. ADD THE ITEM TO THE BUDGET CONTROLLER
        if(input.description!=""&& !isNaN(input.value) && input.value>0)
        {   
            newItem= budgetCtrl.addItem(input.type, input.description, input.value);
            //3. ADD THE ITEM TO THE UI
            UICtrl.addListItem(newItem, input.type);
            //4. clear the fields
            UICtrl.clearFields();
            //5. Calculate and update budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();
        }
    };


    var ctrlDeleteItem= function(event){
        var itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
            var splitId= itemID.split('-');
            var type= splitId[0];
            var Id= splitId[1];
            Id=parseInt(Id);
            //1. delete the item from the data structure
            budgetCtrl.deleteItem(type, Id);
            budgetCtrl.calculateBudget();
            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            //update and show the new budget 
            updateBudget();
            updatePercentages();

            
        
    }
    

    return{
        init: function(){
            setUpEventListeners();
            UIController.displayDate(UIController.getDOMstrings().dateLabel);
        }
    }

})(budgetController, UIController);

controller.init();

