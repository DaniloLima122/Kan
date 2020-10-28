const btnScrollNext = document.getElementById("next");
const btnScrollPrev = document.getElementById("prev");
const containerCards = document.querySelectorAll(".cards-container")[0];
const cards = document.querySelectorAll(".card");
const btndelete = document.querySelectorAll(".delete");
const btnedit = document.querySelectorAll(".edit");
const modal = document.querySelector("#modal");
const addCard = document.getElementById("addnCard");
const saveDataCard = document.getElementById("saveNewCard");
const editCardBtn = document.getElementById("editCard");

const formAddCard = document.getElementById("formAddCard");

const taskName = document.getElementById("taskname");
const taskDescription = document.getElementById("taskdesc");
const taskTime = document.getElementById("tasktime");


const idUserLogged = document.getElementById("userId");
const tasksToDoRadioBtn = document.getElementById("tasksToDo");
const tasksDoneRadioBtn = document.getElementById("tasksDone");
const searchInput = document.getElementById("inputSearch");
const btnSearch = document.getElementById("btnsearch");
const titleContainerTasks = document.getElementsByTagName("h3")[0];
const messageDialog = document.getElementById("messageDialog");

const btnsearch = document.getElementById("btnsearch");


function ShowMessageBox(message,typeColor = "#00cf2d"){

    messageDialog.children[0].textContent = message;
    messageDialog.style.borderLeftColor = typeColor;

    messageDialog.animate([
        {opacity: 0,transform: 'translate(-40vw,-31vh)',display: "none"},
        {opacity: 1,transform: 'translate(-40vw,-11vh)',display: "flex"},
    ],{
        duration: 500,
        easing: "ease-in-out",
        fill: "forwards"                                                            
    })
    
    setTimeout(()=> {
        messageDialog.animate([
            {opacity: 1,transform: 'translate(-40vw,-11vh)',display: "none"},
            {opacity: 0,transform: 'translate(-40vw,-31vh)',display: "flex"},
        ],{
            duration: 500,
            easing: "ease-in-out",
            fill: "forwards"                                                            
        })
    
    },3500);
    
}





let noResult = document.createElement("h2");

function Card(taskData){

    let card = document.createElement("div");
    card.className = "card";
    
    let header = document.createElement("header");
    let headerSpan = document.createElement("span");
    let headearCheckIcon = document.createElement("i");
    headearCheckIcon.className = "fas fa-check";

    headerSpan.append(headearCheckIcon);
    header.append(headerSpan);



    let card_content = document.createElement("div");
    card_content.className = "card-content";
    
    let card_h2 = document.createElement("h2");

    card_h2.textContent = taskData.name;
    
    let card_p = document.createElement("p");
    card_p.textContent = taskData.description;

    card_content.append(card_h2,card_p);
    
    let cardFooter = document.createElement("footer");

    let cardFooterSpanFirst = document.createElement("span");
    let cardFooterSpanFirstIcon = document.createElement("i");
    cardFooterSpanFirstIcon.className = "far fa-calendar-alt";
    
    let cardFooterSpanFirstLabel = document.createElement("label");

    let dateTask = taskData.data.split("T")[0].split("-").reverse().join("/");

    cardFooterSpanFirstLabel.textContent = dateTask;

    cardFooterSpanFirst.append(cardFooterSpanFirstIcon,cardFooterSpanFirstLabel);
    
    let cardFooterDiv = document.createElement("div");
    cardFooterDiv.className = "changeCard";
    
    let cardFooterDivSpanFirst = document.createElement("span");
    cardFooterDivSpanFirst.className = "edit";
    
    let cardFooterDivSpanFirstIcon = document.createElement("i");
    cardFooterDivSpanFirstIcon.className = "fas fa-pencil-alt";
    
    cardFooterDivSpanFirst.append(cardFooterDivSpanFirstIcon);
    
    let cardFooterDivSpanLast = document.createElement("span");
    cardFooterDivSpanLast.className = "delete";
    
    let cardFooterDivSpanSLastLcon = document.createElement("i");
    cardFooterDivSpanSLastLcon.className = "fas fa-trash-alt";

    cardFooterDivSpanLast.append(cardFooterDivSpanSLastLcon);

    cardFooterDiv.append(cardFooterDivSpanFirst,cardFooterDivSpanLast);
    
    cardFooter.append(cardFooterSpanFirst,cardFooterDiv);

    card.append(header,card_content,cardFooter);    

    if(taskData.statusCard == "Done"){

        headerSpan.style.pointerEvents =  "none";
        headearCheckIcon.style.color = "#00cf2d";
        cardFooterDivSpanFirst.style.pointerEvents = "none";   
        cardFooterDivSpanFirst.style.opacity = 0;   
        
    }
    



    cardFooterDivSpanLast.addEventListener("click", () => {
      
        CardToDelete(taskData.id,deleteCardFromUI(card));      
    });

    headerSpan.addEventListener("click", () => {
        SetAsDone(taskData.id)
        deleteCardFromUI(card);
    });
    
    cardFooterDivSpanFirst.addEventListener("click", () => {
        
        formAddCard.addEventListener("submit", (e) => e.preventDefault());

        PrepareEdittask(formAddCard,taskData);    
        
    });
    
    return card;
    
}

function PrepareEdittask(formData,taskData){
    openModal();
    
    taskName.value = taskData.name;
    taskDescription.value = taskData.description;
    taskTime.value = taskData.data.split("T")[0];
    editCardBtn.style.display = "block";
    saveDataCard.style.display = "none";
    
    formAddCard.children[0].textContent = "Edit Task";
    
    editCardBtn.addEventListener("click", () => {
        
        
        if([taskName,taskDescription,taskTime].every(ValidaCampo)){
            
            containerCards.children[0].innerHTML = "";
            EditTask();
        }
    });

    
    function EditTask(){

        const task = new FormData(formData);


        task.append("id",taskData.id);
        task.append("statusCard",taskData.statusCard);

        $.ajax({
            url: "https://localhost:5001/Dashboard/EditTask",
            type: "post",
            data: task, 
            processData: false,
            contentType:false
        }).done((response,status) => {


            if(status == "success"){
                ShowMessageBox("Tarefa editada com sucesso!")
                ListAllCards(taskData.statusCard);
            }
            else{
                console.log("Algo deu errado")
                console.log(response)
            }
        });
        
    }

}




function SetAsDone(taskId){
    $.ajax({
        
        url: "https://localhost:5001/Dashboard/SetAsDone",
        type: "post",
        data: {"id": taskId}
    }).done((response,status) => {
        
        if(status == "success"){
            ShowMessageBox(response);
        }
    });
}

function searchCards(search){
        
    noResult.className = "noresult";
    noResult.textContent = `Nenhum resultado encontrado para sua pesquisa`;
    

    $.ajax({
        url: "https://localhost:5001/Dashboard/Search",
        type: "post",
        data: {"search": search}
    }).done((response) => {           
        
        
        if(response.length > 0){

            for (const card of response) {
                
                containerCards.children[0].classList.remove("noresultsInnerCard");
                containerCards.children[0].append(Card(card));
            }
        }else{
            
            containerCards.children[0].classList.add("noresultsInnerCard");
            containerCards.children[0].append(noResult);
        }
        
    })
}

function ListAllCards(statusTask){
    
    
    $.ajax({
        url: "https://localhost:5001/Dashboard/Cards",
        type: "get",
        data: {"status": statusTask},
    }).done((response,status) => {


        if(status == "success"){

            if(response.length > 0){
            


                   for (const card of response) {
                
                
                          containerCards.children[0].append(Card(card));
                          containerCards.children[0].classList.remove("noresultsInnerCard");
                        }
            }else{

                let statusTarefa = statusTask == "ToDo" ? "Nenhuma tarefa pendente, para adicionar uma nova clique em '+'" : "Nenhuma tarefa marcada como concluída";    
                
                noResult.textContent = statusTarefa;
                
                noResult.className = "noresult";
                containerCards.children[0].classList.add("noresultsInnerCard");
                containerCards.children[0].append(noResult);
            }
        }
            
        })
    }

ListAllCards("ToDo");

function sendDataCards(dados){

    $.ajax({
        url: "https://localhost:5001/Dashboard/AddCard",
        type: "post",
        data: dados,
        processData: false,
        contentType:false
    }).done((response,status) => {


        if(status == "success"){

            
            
            containerCards.children[0].classList.remove("noresultsInnerCard");
            
            
            noResult.style.display = "none";
            
            
            containerCards.children[0].append(Card(response));
        }
        
    })
}

function CardToDelete(cardId,deletefromUI){
    
    $.ajax({
        url: "https://localhost:5001/Dashboard/DeleteCard",
        type: "post",
        data: {"id": cardId},
    }).done(status => {
        
        if(status == "success"){

            deletefromUI();
            
        }
    })
}



function openModal(){
    
    modal.style.display = "grid";
    editCardBtn.style.display = "none";
    saveDataCard.style.display = "block";
}

function deleteCardFromUI(card){
    
    card.animate([
        {opacity: 1},
        {opacity: 0}
    ],{
        duration: 200,
        fill: "forwards"                                                            
    })
    
    setTimeout(()=> {
        card.style.display = "none";
        card.remove();    
    },1000);
    
}

btnScrollNext.addEventListener("click", () =>{
    
    containerCards.scrollBy({left:500,top:0,behavior: "smooth"});
});


btnScrollPrev.addEventListener("click", () =>{
    
    containerCards.scrollBy({left:-500,top:0,behavior: "smooth"});
});


addCard.addEventListener("click", () =>{
    
    formAddCard.children[0].textContent = "New Task";
    formAddCard.reset();
    openModal();
});

modal.addEventListener("click", (e) =>{
    
    if(e.target.id == modal.id){
        
        modal.style.display = "none";
    }
});


function FormatedDate(data){

    let mdata = data.split("-").join("-").concat("T00:00:00");

    return mdata;
}

saveDataCard.addEventListener("click", (e) =>{


    e.preventDefault();

    tasksToDoRadioBtn.checked = true;
    
    const formData = new FormData(formAddCard);

    formData.set("data",FormatedDate(formData.get("data"))) ;

    formData.get("data");

    formData.append("statusCard","ToDo");            

    sendDataCards(formData);
});


tasksToDoRadioBtn.addEventListener("click", () => {

    containerCards.children[0].innerHTML = "";
    ListAllCards("ToDo");
    titleContainerTasks.textContent = `Tarefas pendentes`;
});

tasksDoneRadioBtn.addEventListener("click", () => {
    
    containerCards.children[0].innerHTML = "";
    ListAllCards("Done");
    titleContainerTasks.textContent = `Tarefas concluídas`;
});


btnsearch.addEventListener("click", ()=>{
    
    if(ValidaCampo(searchInput)){
        titleContainerTasks.textContent = `Resultados da sua busca por "${searchInput.value}"`;
        containerCards.children[0].innerHTML = "";

        searchCards(searchInput.value); 
    }else{
        ShowMessageBox("Preencha o campo para pesquisar!","yellow");
    }
})

function ValidaCampo(campo){

    let campoValido = campo.value.trim().length > 0 ? true : false;

    return campoValido;
    
}