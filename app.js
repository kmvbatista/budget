

var budgetController = (function(){
    var Expenses= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
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
        getBudget: function() {
            return{
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: ((data.percent).toFixed(2)*100)+'%'
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
        percentageLabel: '.budget__expenses--percentage'
    };

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
                html='<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element= DOMstrings.expensesContainer;
                html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder text with some actual text

            var newHtml= html.replace('%id%', obj.id);
            newHtml= newHtml.replace('%description%', obj.description);
            newHtml= newHtml.replace('%value%', obj.value);  
            newHtml= newHtml.replace('%percentage%', obj.percentage)

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
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
            document.querySelector(DOMstrings.budgetLable).textContent= obj.budget;
            document.querySelector(DOMstrings.incomeLable).textContent= obj.totalInc;
            document.querySelector(DOMstrings.expensesLable).textContent= obj.totalExp;
            if(obj.percentage>0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage;
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---'
            }
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
    };

    var updateBudget= function(){
        //1. CALCULATE THE BUDGET
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget= budgetCtrl.getBudget();
        //3. DISPLAY THE BUDGET ON THE UI
        UICtrl.displayBudget(budget);
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
            
        }
        

    };

    return{
        init: function(){
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();

