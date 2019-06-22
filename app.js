var budgetController = (function(){
    var Expense= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
    }
    var Income= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
    }

    
    var data={
        allItems:{
            exp: [],
            incomes: []
        },
        totals: {
            exp: 0, 
            inc:0 
        }
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

            new Expense(ID, des, val);

            if(type==='exp'){
                newItem= new Expense(ID, des, val);
            }
            else if( type==='inc'){
                newItem= new Income(ID,des, val);
            }

            data.allItems[type].push(newItem);
            
            return newItem;
        }
    }

})();

var UIController = (function(){
    var DOMstrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return{
        getInput: function(){
            return{
            type: document.querySelector(DOMstrings.inputType).value, 
            
            description: document.querySelector(DOMstrings.inputDescription).value,

            value: document.querySelector(DOMstrings.inputValue).value
            };
        }, 

        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();

var controller = (function(budgetCtrl, UICtrl){
    var setUpEventListeners= function(){
        var DOM= UICtrl.getDOMstrings();

        documento.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
                if(event.keyCode===13 || event.which===13){
                    ctrlAddItem();
                }
        });
    };
    var ctrlAddItem= function(){
        var input, newItem;

        //1. GET THE FIELD INPUT DATA
        input= UICtrl.getInput();
        console.log(input);
        //2. ADD THE ITEM TO THE BUDGET CONTROLLER
        newItem= budgetController.addItem(input.type, input.description, input.value);
        //3. ADD THE ITEM TO THE UI

        //4. CALCULATE THE BUDGET

        //5. DISPLAY THE BUDGET ON THE UI

    };

    return{
        init: function(){
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
